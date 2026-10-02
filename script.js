const API_KEY = "df324387b2814f86be6b874ec3212709";
const NEWS_API_URL = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => fetchNews("India"));

function reload() {
    window.location.reload();
}

function newsRequestUrl(query) {
    const encoded = encodeURIComponent(query);
    const isLocal = ["localhost", "127.0.0.1"].includes(location.hostname);

    // NewsAPI's developer plan only allows browser requests from localhost.
    // On Vercel, fetch through a serverless proxy instead.
    if (isLocal) {
        return `${NEWS_API_URL}${encoded}&apiKey=${API_KEY}`;
    }
    return `/api/news?q=${encoded}`;
}

async function fetchNews(query) {
    try {
        const res = await fetch(newsRequestUrl(query));
        const data = await res.json();
        if (!data.articles) {
            console.error("News API error:", data);
            bindData([]);
            return;
        }
        bindData(data.articles);
    } catch (error) {
        console.error("Error fetching the news: ", error);
        bindData([]);
    }
}

function bindData(articles) {
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    cardsContainer.innerHTML = "";

    if (!articles || articles.length === 0) {
        cardsContainer.innerHTML = "<p class=\"news-desc\">No articles found. Try another topic.</p>";
        return;
    }

    articles.forEach((article) => {
        if (!article.urlToImage) return;

        const cardClone = newsCardTemplate.content.cloneNode(true);
        fillDataInCard(cardClone, article);
        cardsContainer.appendChild(cardClone);
    });
}

function fillDataInCard(cardClone, article) {
    const date = new Date(article.publishedAt).toLocaleString("en-US", {
        timeZone: "Asia/Jakarta",
    });

    cardClone.querySelector("#news-img").src = article.urlToImage;
    cardClone.querySelector("#news-title").innerHTML = article.title;
    cardClone.querySelector("#news-source").innerHTML = `${article.source.name} : ${date}`;
    cardClone.querySelector("#news-desc").innerHTML = article.description;

    cardClone.firstElementChild.addEventListener("click", () => {
        window.open(article.url, "_blank");
    });
}

let curSelectedNav = null;
function onNavItemClick(id) {
    fetchNews(id);
    const navItem = document.getElementById(id);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav?.classList.add("active");
}

const searchbutton = document.getElementById("search-button");
const searchtext = document.getElementById("search-text");

searchbutton.addEventListener("click", () => {
    const query = searchtext.value;
    if (!query) return;
    fetchNews(query);
});
