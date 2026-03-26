/**
 * Bulk export script — writes all questionnaire answers + ML recommendations
 * from MongoDB to the configured Google Spreadsheet.
 *
 * Usage (from the server/ directory):
 *   npm run export-to-sheets
 *
 * Required env vars (same as the live server):
 *   MONGODB_URI
 *   GOOGLE_SHEETS_SPREADSHEET_ID
 *   GOOGLE_SHEETS_CREDENTIALS_JSON  OR  GOOGLE_SHEETS_CREDENTIALS_PATH
 *   (optional) GOOGLE_SHEETS_WORKSHEET_NAME  — defaults to the first tab
 *
 * The script is safe to re-run; it clears the data rows below the header
 * and rewrites them fresh so there are no duplicates.
 */

import 'dotenv/config'
import mongoose from 'mongoose'
import { google } from 'googleapis'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { env } from '../config/env.js'
import QuestionnaireResponse from '../models/QuestionnaireResponse.model.js'
import PathwayRecommendation from '../models/PathwayRecommendation.model.js'
import User from '../models/User.model.js'

// ── Helpers ──────────────────────────────────────────────────────────────────

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function die(msg: string): never {
  console.error(`\n❌  ${msg}`)
  process.exit(1)
}

function getSpreadsheetId(): string {
  const raw = env.googleSheetsSpreadsheetId?.trim()
  if (!raw) die('GOOGLE_SHEETS_SPREADSHEET_ID is not set in your .env file.')

  // Accept full sheet URLs — extract just the ID portion
  const urlMatch = raw.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/)
  return urlMatch?.[1] ?? raw
}

async function getAuthClient() {
  const options: ConstructorParameters<typeof google.auth.GoogleAuth>[0] = {
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  }

  if (env.googleSheetsCredentialsJson) {
    options.credentials = JSON.parse(env.googleSheetsCredentialsJson)
  } else if (env.googleSheetsCredentialsPath) {
    const credPath = path.resolve(__dirname, '../..', env.googleSheetsCredentialsPath)
    if (!fs.existsSync(credPath)) {
      die(
        `Credentials file not found: ${credPath}\n` +
          'Set GOOGLE_SHEETS_CREDENTIALS_JSON or GOOGLE_SHEETS_CREDENTIALS_PATH in your .env.'
      )
    }
    options.keyFile = credPath
  } else {
    console.log(
      '⚠️  No credentials env var set — falling back to Application Default Credentials (ADC).'
    )
  }

  const auth = new google.auth.GoogleAuth(options)
  return auth.getClient()
}

function a1Range(worksheetName: string, range: string): string {
  const escaped = worksheetName.replace(/'/g, "''")
  return `'${escaped}'!${range}`
}

// ── Headers (must match googleSheets.service.ts exactly) ─────────────────────

const HEADERS = [
  'Timestamp',
  'User ID',
  'User Name',
  'User Email',
  'Academic Level',
  'Primary Sport',
  'Participation Years',
  'Participation Level',
  'Fitness Level',
  'Technical Skill',
  'Leadership',
  'Data Comfort',
  'Motivation',
  'Career Importance',
  'Work Environment',
  'Biggest Challenge',
  'Injury History',
  'Career Interests',
  'Top Recommendation',
  'Top Match %',
  'All Recommendations',
  'Motivation Recommendation',
  'Submitted At'
]

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('📊  AthleteIQ → Google Sheets Export\n')

  // 1. Validate config upfront
  const spreadsheetId = getSpreadsheetId()
  console.log(`✅  Spreadsheet ID : ${spreadsheetId}`)

  // 2. Connect to MongoDB
  console.log('\n🔌  Connecting to MongoDB...')
  await mongoose.connect(env.mongoUri)
  console.log(`✅  Connected: ${env.mongoUri.replace(/:\/\/([^:]+:[^@]+@)/, '://<credentials>@')}`)

  // 3. Fetch all records with their paired recommendations
  console.log('\n📋  Fetching questionnaire responses...')
  const responses = await QuestionnaireResponse.find({}).sort({ createdAt: 1 }).lean()
  console.log(`    Found ${responses.length} response(s)`)

  if (responses.length === 0) {
    console.log('\n⚠️  No questionnaire responses found in the database. Nothing to export.')
    await mongoose.disconnect()
    return
  }

  // Build a map of userId → user document for name/email enrichment
  const userIds = [...new Set(responses.map((r) => String(r.user)))]
  const users = await User.find({ _id: { $in: userIds } }).lean()
  const userMap = new Map(users.map((u) => [String(u._id), u]))

  // Build a map of questionnaireResponseId → recommendation
  const responseIds = responses.map((r) => r._id)
  const recommendations = await PathwayRecommendation.find({
    questionnaireResponse: { $in: responseIds }
  }).lean()
  const recMap = new Map(recommendations.map((r) => [String(r.questionnaireResponse), r]))

  console.log(`    Found ${recommendations.length} recommendation(s)`)

  // 4. Build rows
  const rows: (string | number)[][] = responses.map((r) => {
    const rec = recMap.get(String(r._id))
    const user = userMap.get(String(r.user))
    const topRec = rec?.recommendations?.[0]

    return [
      new Date().toISOString(),                                              // Timestamp (export time)
      String(r.user),                                                        // User ID
      user?.name ?? '',                                                      // User Name
      user?.email ?? '',                                                     // User Email
      r.academic_level,
      r.primary_sport,
      r.participation_years,
      r.participation_level,
      r.fitness_level,
      r.technical_skill,
      r.leadership,
      r.data_comfort,
      r.motivation,
      r.career_importance,
      r.work_environment,
      r.biggest_challenge,
      r.injury_history,
      r.career_interests.join(', '),
      topRec?.pathwayName ?? '',
      topRec?.matchPercentage ?? '',
      rec?.recommendations?.map((x) => `${x.pathwayName}(${x.matchPercentage}%)`).join(' | ') ?? '',
      rec?.motivationRecommendation?.pathwayName ?? '',
      r.submittedAt ? new Date(r.submittedAt).toISOString() : ''             // Original submit time
    ]
  })

  // 5. Authenticate and get sheets client
  console.log('\n🔑  Authenticating with Google Sheets API...')
  const authClient = await getAuthClient()
  const sheets = google.sheets({ version: 'v4', auth: authClient as any })

  // 6. Resolve worksheet name
  const worksheetName =
    env.googleSheetsWorksheetName ??
    (await sheets.spreadsheets
      .get({ spreadsheetId, includeGridData: false })
      .then((r) => r.data.sheets?.[0]?.properties?.title ?? 'Sheet1'))

  console.log(`✅  Target worksheet: "${worksheetName}"`)

  // 7. Write header row
  console.log('\n📝  Writing header row...')
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: a1Range(worksheetName, 'A1'),
    valueInputOption: 'RAW',
    requestBody: { values: [HEADERS] }
  })

  // 8. Clear any existing data rows below the header (row 2 downward)
  console.log('🧹  Clearing old data rows...')
  await sheets.spreadsheets.values.clear({
    spreadsheetId,
    range: a1Range(worksheetName, `A2:${String.fromCharCode(64 + HEADERS.length)}10000`)
  })

  // 9. Write all data rows in one batch call
  console.log(`✏️   Writing ${rows.length} row(s)...`)
  await sheets.spreadsheets.values.update({
    spreadsheetId,
    range: a1Range(worksheetName, 'A2'),
    valueInputOption: 'RAW',
    requestBody: { values: rows }
  })

  console.log(`\n🎉  Export complete! ${rows.length} row(s) written to "${worksheetName}".`)
  console.log(
    `🔗  Open: https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit\n`
  )

  await mongoose.disconnect()
  console.log('🔌  Disconnected from MongoDB')
}

main().catch((err) => {
  console.error('\n❌  Export failed:', err)
  mongoose.disconnect().finally(() => process.exit(1))
})
