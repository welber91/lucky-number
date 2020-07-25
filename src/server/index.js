import * as admin from "firebase-admin";
import * as functions from "firebase-functions";
import next from "next";

admin.initializeApp();

const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
  // the absolute directory from the package.json file that initialises this module
  // IE: the absolute path from the root of the Cloud Function
  conf: { distDir: "dist/client" },
});
const handle = app.getRequestHandler();

const server = functions.https.onRequest((request, response) => {
  // log the page.js file or resource being requested
  console.log("File: " + request.originalUrl);
  return app.prepare().then(() => handle(request, response));
});

exports.getNumber = functions.https.onRequest(async (req, res) => {
  const result = await getNumber();
  res.json(result.data);
});

exports.bumpNumber = functions.https.onRequest(async (req, res) => {});

const getNumber = async () => {
  const query = await admin.firestore().collection("number").get();
  if (query._size === 0) {
    return { id: null, data: { n: 0 } };
  }
  return { id: query.docs[0].id, data: query.docs[0].data() };
};

exports.scheduledFunction = functions.pubsub
  .schedule("every 1 hours")
  .onRun((context) => {
    console.log("This will be run every 1 minutes!");
    getNumber()
      .then((number) => {
        if (!number.id) {
          admin
            .firestore()
            .collection("number")
            .add({ n: 1 })
            .then((result) => {
              console.log("Number added");
              return true;
            })
            .catch((err) => {
              console.log({ error: err });
            });
        } else {
          admin
            .firestore()
            .collection("number")
            .doc(number.id)
            .set({ n: number.data.n + 1 })
            .then((result) => {
              console.log(`Number incremented to ${number.data.n + 1}`);
              return true;
            })
            .catch((err) => {
              console.log({ error: err });
            });
        }
        return true;
      })
      .catch((err) => {
        console.log({ error: err });
      });
  });

const nextjs = {
  server,
};

export { nextjs };
