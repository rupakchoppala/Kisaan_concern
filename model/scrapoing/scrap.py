import requests
from bs4 import BeautifulSoup
import json
import time
import os

BASE_URL = "https://katyayanikrishidirect.com"
COLLECTION_URL = f"{BASE_URL}/collections/herbicides-1"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
}

def get_full_url(relative_url):
    return BASE_URL + relative_url

def fetch_html(url):
    try:
        res = requests.get(url, headers=HEADERS)
        res.raise_for_status()
        return res.text
    except Exception as e:
        print(f"[ERROR] Failed to fetch {url} — {e}")
        return None

def scrape_product_page(product_url):
    html = fetch_html(product_url)
    if not html:
        return {}

    soup = BeautifulSoup(html, "html.parser")
    description = ""
    desc_block = soup.select_one(".product__description.rte.quick-add-hidden")
    if desc_block:
        description = desc_block.get_text(separator="\n").strip()

    return {"description": description}

def save_product_data(new_data, filename="all_fertilizers_data.json"):
    # Load existing data
    if os.path.exists(filename):
        with open(filename, "r", encoding="utf-8") as f:
            try:
                existing_data = json.load(f)
            except json.JSONDecodeError:
                existing_data = []
    else:
        existing_data = []

    # Combine and write back
    combined_data = existing_data + new_data
    with open(filename, "w", encoding="utf-8") as f:
        json.dump(combined_data, f, indent=2, ensure_ascii=False)

    print(f"✅ Saved {len(new_data)} products. Total now: {len(combined_data)}")

def scrape_collection_page(url):
    html = fetch_html(url)
    if not html:
        return []

    soup = BeautifulSoup(html, "html.parser")
    products = []

    for card in soup.select("a.full-card-link"):
        try:
            name_tag = card.select_one("h3.card__heading span")
            image_tag = card.select_one("img")
            price_sale = card.select_one(".price-item--sale")
            price_regular = card.select_one("s.price-item--regular")
            discount_tag = card.select_one(".card__badge.top.left span")
            link = card.get("href")
            full_link = get_full_url(link)

            # Scrape details from product page
            details = scrape_product_page(full_link)
            time.sleep(1)  # Avoid hammering the server

            product = {
                "name": name_tag.text.strip() if name_tag else None,
                "image": "https:" + image_tag["src"] if image_tag and image_tag.has_attr("src") else None,
                "sale_price": price_sale.text.strip() if price_sale else None,
                "original_price": price_regular.text.strip() if price_regular else None,
                "discount": discount_tag.text.strip() if discount_tag else None,
                "product_link": full_link,
                "description": details.get("description", "")
            }

            products.append(product)
            save_product_data([product])  # Pass product data as a list

        except Exception as e:
            print(f"[ERROR] Skipping product — {e}")
            continue

    return products, soup

def get_next_page_url(soup):
    next_link = soup.select_one("li.pagination__item--next a")
    return get_full_url(next_link["href"]) if next_link else None

# Main scraping loop
all_products = []
next_page = COLLECTION_URL
page_num = 1

while next_page:
    print(f"\n🔄 Scraping page {page_num}: {next_page}")
    products, soup = scrape_collection_page(next_page)
    all_products.extend(products)
    next_page = get_next_page_url(soup)
    page_num += 1
    time.sleep(2)  # Wait before loading next page
