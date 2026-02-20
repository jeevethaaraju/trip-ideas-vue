import express from "express";
import fetch from "node-fetch";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

console.log("API KEY:", process.env.GOOGLE_API_KEY);

const app = express();
app.use(cors({ origin: "*" }));

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

app.get("/getTrips", async (req, res) => {
    const { state, activity, keyword = "" } = req.query;

    console.log("Request received:", { state, activity, keyword });

    if (!state) return res.json([]);

    let allResults = [];
    let pageToken = null;

    try {
        do {
            let url = `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodeURIComponent(
                `${keyword || activity} places in ${state}, Malaysia`
            )}&key=${GOOGLE_API_KEY}`;

            console.log("Fetching URL:", url);

            if (pageToken) {
                url += `&pagetoken=${pageToken}`;
                await new Promise(r => setTimeout(r, 2000));
            }

            const resp = await fetch(url);
            const data = await resp.json();

            console.log("Google API status:", data.status);
            console.log("Results count:", data.results?.length || 0);

            if (data.results) {
                allResults.push(...data.results);
            }

            pageToken = data.next_page_token || null;

        } while (pageToken);

        const formatted = allResults.map(place => ({
            name: place.name,
            address: place.formatted_address,
            imageUrl: place.photos
                ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photo_reference=${place.photos[0].photo_reference}&key=${GOOGLE_API_KEY}`
                : null,
            mapLink: `https://www.google.com/maps/place/?q=place_id:${place.place_id}`,
            website: place.website || null
        }));

        console.log("Total formatted results:", formatted.length);

        res.json(formatted);

    } catch (err) {
        console.error("Error:", err);
        res.status(500).json([]);
    }
});

app.listen(3000, () =>
    console.log("✅ Backend running at http://localhost:3000")
);