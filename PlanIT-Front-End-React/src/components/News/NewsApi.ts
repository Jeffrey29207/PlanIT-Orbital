// Helper file to fetch the news API as a content in the landing page
// API_KEY = "4fe2aff035a8452cbce46d5853dec645";

const URL = "https://newsapi.org/v2/top-headlines?country=us&apiKey=4fe2aff035a8452cbce46d5853dec645&category=business";

export const fetchNewsApi = async () => {
    return await fetch(URL)
    .then(res => res.json())
    .then(data => {const {articles} = data; return articles});
}