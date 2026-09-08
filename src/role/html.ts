import axios from 'axios'
import fs from 'fs-extra'

import { print } from '#utils'
import { htmlDirPath, htmlRolePath } from '#config'

const baseUrl = 'https://wiki.biligame.com/starengine'
const roleUrl = `${baseUrl}/%E6%98%9F%E8%B6%B4%E8%A7%92%E8%89%B2%E5%9B%BE%E9%89%B4`

// Functions to fetch and save the HTML content of the role page.
export async function requestRoleHtml() {
  const { status, data } = await axios.get(roleUrl)
  console.log(status)
  const isSuccess = status === 200
  if (isSuccess) {
    print('Role response saved successfully.', 'success')
  } else {
    print('Failed to save role response.', 'error')
  }
  // console.log(data)
  return data
}

// Function to save the HTML content of the role page to a local file.
export async function saveRoleHtml(html: string) {
  try {
    await fs.writeFile(htmlRolePath, html)
    print('Role HTML saved successfully.', 'success')
    return true
  } catch (error) {
    print('Failed to save role HTML.', 'error')
    return false
  }
}

// Function to get the HTML content of the role page, either from the local file or by requesting it from the server.
export async function getRoleHtml() {
  await fs.ensureDir(htmlDirPath)
  const haxExsitHtml = await fs.pathExists(htmlRolePath)
  if (haxExsitHtml) {
    const html = await fs.readFile(htmlRolePath, 'utf-8')
    return html
  } else {
    const html = await requestRoleHtml()
    await saveRoleHtml(html)
    return html
  }
}
