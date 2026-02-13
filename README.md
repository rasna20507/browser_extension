# Notepad 

Notepad is a simple Chrome extension designed to help you save and organize important text from any webpage. Whether you're researching, studying, or just browsing, Notepad lets you highlight text from web and store them in one easy-to-access place.

This is my first coding project, created to learn the basics of JavaScript and browser extensions!

##  Features

### 1. Smart Highlighting
* **Quick Selection:** Simply select any text on a page, and a small menu appears near your cursor.
* **4 Color Categories:**
    * **Yellow**: Important information.
    * **Red**: Questions or things to look up.
    * **Teal**: Definitions and key terms.
    * **Green**: Quotes you want to remember.
* **Instant Save:** Your highlights are saved automatically to your browser.

### 2. Dashboard (The Popup)
Click the extension's icon in your browser toolbar to:
* **View All Highlights:** See everything you've saved in a clean list.
* **Filter:** You can sort your notes into category (Doubt, Quotes, Definitions , Important note).
* **Source Links:** Every highlight remembers the exact website it was saved from.
* **Manage:** Easily copy text to your clipboard or delete old highlights.

---

## How It’s Built

The extension is made using standard web technologies: **HTML, CSS, and JavaScript.**

* **`manifest.json`**: Chrome extension configuration.Mentions permissions required.
* **`content.js`**: The script that runs on the webpages you visit. It waits for text selection and shows the buttons.
* **`popup.html / popup.js`**: This controls the small window that pops up when you click the extension icon. It handles displaying and filtering your saved data.
* **`content.css`**: The styling file that makes the buttons look good.

---

## Permissions Used

*storage: To save and retrieve highlights
*activeTab: To know which page you're on
*scripting: To inject content script on webpages
*tabs: To open new tabs when visiting saved pages

---
## Privacy & Data
* **Local Storage:** All highlights are stored locally in the browser using the `chrome.storage.local` API.
* **Private:** No data is ever sent to a server. The highlights stay on users device.
* **Offline:** Since it doesn't use a database, can view highlights even without an internet connection.

---

## How to Install (For Development)

To run this extension locally in your browser, follow these steps to load it as a "Developer Extension":

1.  Download or clone this folder.
2.  Open Chrome and go to `chrome://extensions/`.
3.  Turn on **"Developer mode"** (toggle in the top right).
4.  Click **"Load unpacked"** and select the folder containing these files.
5.  Pin **notepad** to your toolbar for easy access!

---

## Limitations:

Won't work on Chrome system pages (chrome://)
Limited functionality on sites with strict security policies
Shadow DOM content may not be selectable on some modern apps
---
## Useful For
Research papers: save important quotes and definitions
News articles: mark questions and important points
Blog reading: collect inspiration and ideas
General web browsing: organize information

## Future Ideas
As we learn more, we hope to add:
* **Search Bar:** To find specific words within the user's highlights.
* **Dark Mode:** For easier reading at night.
* **Integration with note-taking apps**

