const express = require("express");
const router = express.Router();
const admin = require("./firebaseAdmin");

// Get Users

router.get("/", async (req, res) => {
  try {
    const listUsers = async (nextPageToken) => {
      const result = await admin.auth().listUsers(1000, nextPageToken);
      console.log("result for user list", result);

      const users = result.users.map((userRecord) => ({
        uid: userRecord.uid,
        email: userRecord.email,
        displayName: userRecord.displayName,
        photoURL: userRecord.photoURL,
        providerData: userRecord.providerData,
        joinTime: userRecord.metadata.creationTime,
        lastSignInTime: userRecord.metadata.lastRefreshTime,
      }));

      if (result.pageToken) {
        const next = await listUsers(result.pageToken);
        return users.concat(next);
      }

      return users;
    };

    const allusers = await listUsers();
    res.json(allusers);
  } catch (error) {
    console.log("Error fetching users:", error);
    res.status(500).json({ error: "internal server error" });
  }
});

module.exports = router;
