module.exports = async (req, res) => {
    try {
        const query = req.query.q || "India";
        const apiKey = process.env.NEWS_API_KEY || "df324387b2814f86be6b874ec3212709";
        const newsRes = await fetch(
            `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&apiKey=${apiKey}`
        );
        const data = await newsRes.json();

        res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate");
        res.status(newsRes.status).json(data);
    } catch (error) {
        res.status(500).json({ status: "error", message: "Failed to fetch news" });
    }
};
