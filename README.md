# Scraping APIs for Devs

A comprehensive collection of **2,622+ ready-to-use scraping and data APIs** for developers, organized by category. All APIs are sourced from the [Apify](https://apify.com) platform.

## 📚 Table of Contents

| Category | Count |
|----------|-------|
| [Agents](./agents-apis-250/README.md) | 250 |
| [AI](./ai-apis-173/README.md) | 173 |
| [Automation](./automation-apis-218/README.md) | 218 |
| [Developer Tools](./developer-tools-apis-172/README.md) | 172 |
| [E-commerce](./ecommerce-apis-147/README.md) | 147 |
| [Integrations](./integrations-apis-191/README.md) | 191 |
| [Jobs](./jobs-apis-167/README.md) | 167 |
| [Lead Generation](./lead-generation-apis-80/README.md) | 80 |
| [MCP Servers](./mcp-servers-apis-28/README.md) | 28 |
| [News](./news-apis-198/README.md) | 198 |
| [Open Source](./open-source-apis-216/README.md) | 216 |
| [Other](./other-apis-133/README.md) | 133 |
| [Real Estate](./real-estate-apis-130/README.md) | 130 |
| [SEO Tools](./seo-tools-apis-159/README.md) | 159 |
| [Social Media](./social-media-apis-73/README.md) | 73 |
| [Travel](./travel-apis-139/README.md) | 139 |
| [Videos](./videos-apis-148/README.md) | 148 |

## 🚀 Getting Started

```bash
# Install dependencies (none required — uses Node.js built-ins)
node --version  # Requires Node.js 16+

# Fetch fresh data from the Apify Store API
npm run fetch

# Filter to scraping-related APIs only
npm run filter

# Regenerate the category README files
npm run generate-readme
```

## 🛠 Scripts

All scripts live in [`scripts/`](./scripts/) and use only Node.js built-ins (no `npm install` needed):

| Script | Description |
|--------|-------------|
| `fetch_apify_actors.js` | Fetches all actors from the Apify Store API with affiliate links |
| `filter_scraping_apis.js` | Filters README tables to keep scraping-related APIs |
| `generate_readme_clean.js` | Generates a clean main README from `apify_actors.json` |
| `limit_to_top_250.js` | Trims each category to at most 250 entries |
| `remove_duplicate_apis.js` | Deduplicates API entries across categories |
| `update_main_readme.js` | Updates the root README with current category data |
| `update_main_readme_counts.js` | Syncs API counts in the root README |

## 📖 Use Cases

- **Data extraction** from websites and social media
- **Automation** of workflows and business processes
- **Market intelligence** and competitor analysis
- **Lead generation** and contact discovery
- **E-commerce** monitoring and price tracking

## 📝 Notes

- All API links include affiliate tracking (`?fpr=p2hrc6`)
- Data is sourced from the [Apify Store](https://apify.com/store)
- Run `npm run fetch` to refresh the API list from Apify's live API
- The `apify_actors.json` output file is excluded from version control (`.gitignore`)

---

*Based on [scraping-apis-for-devs](https://github.com/cporter202/scraping-apis-for-devs) by cporter202.*
