import Certification from "../models/certificationModel.js";

export const getCertificationLink = async (req, res) => {
    try {
        const certification = await Certification.findOne();
        if (!certification) {
            return res.status(404).json({ message: "Certification link not found." });
        }
        return res.status(200).json(certification);
    } catch (error) {
        console.error("Error fetching certification link:", error);
        return res.status(500).json({ message: `Error fetching certification link: ${error.message}` });
    }
};

export const createOrUpdateCertificationLink = async (req, res) => {
    try {
        const { link } = req.body;
        if (!link) {
            return res.status(400).json({ message: "Certification link is required." });
        }

        let certification = await Certification.findOne();
        if (certification) {
            // Update existing link
            certification.link = link;
            await certification.save();
            return res.status(200).json({ message: "Certification link updated successfully.", certification });
        } else {
            // Create new link
            certification = await Certification.create({ link });
            return res.status(201).json({ message: "Certification link created successfully.", certification });
        }
    } catch (error) {
        console.error("Error managing certification link:", error);
        return res.status(500).json({ message: `Error managing certification link: ${error.message}` });
    }
};
