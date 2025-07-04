
import { nanoid } from "nanoid";
import { urls } from "../modules/Url.js";


export const LongUrl = async (req, res) => {
    const { longUrl, expirationDate } = req.body;
    const trimmedLongUrl = longUrl.trim();

    if (!longUrl) {
        return res.status(400).json({ message: "Long URL is required" });
    }

    const urlCode = nanoid(6);

    try {
        const newUrl = {
            originalUrl: trimmedLongUrl,
            shortUrl: urlCode,
            createdAt: new Date(),
            expirationDate: expirationDate ? new Date(expirationDate) : null,
            userId: req.user._id
        };
        await urls.create(newUrl);
        return res.status(201).json({
            message: "Short URL created",
            shortUrl: `${req.protocol}://${req.get('host')}/${urlCode}`,
            longUrl
        });
    } catch (error) {
        console.error("Error processing long URL:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const getUrl = async (req, res) => {
    const { shortUrl } = req.params;
    console.log("Short URL:", shortUrl);

    try {
        const url = await urls.findOne({ shortUrl });

        if (!url) {
            return res.status(404).json({ message: "URL not found" });
        }

        if (url.expirationDate && url.expirationDate < new Date()) {
            return res.status(410).json({ message: "URL expired" });
        }

        return res.redirect(url.originalUrl);
    } catch (error) {
        console.error("Error fetching URL:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};


export const getAllUrls = async (req, res) => {
    const { status } = req.query;
    try {
        const urlss = await urls.find({ userId: req.user._id });
        const now = new Date();
        const urlsWithStatus = urlss.map(url => {
            let currentStatus = 'active';

            if (url.expirationDate && url.expirationDate < now) {
                currentStatus = 'expired';
            }

            return {
                _id: url._id,
                originalUrl: url.originalUrl,
                shortUrl: `${req.protocol}://${req.get('host')}/${url.shortUrl}`,
                expirationDate: url.expirationDate,
                createdAt: url.createdAt,
                status: currentStatus
            };
        });


        let findUrls = urlsWithStatus;
        if (status === 'active') {
            findUrls = urlsWithStatus.filter(url => url.status === 'active');
        }
        else if (status === 'expired') {
            findUrls = urlsWithStatus.filter(url => url.status === 'expired');
        }
        return res.status(200).json(findUrls);
    } catch (error) {
        console.error("Error fetching URLs:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}


export const deleteUrl = async (req, res) => {
    await urls.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    return res.json({ message: 'URL deleted' });
};