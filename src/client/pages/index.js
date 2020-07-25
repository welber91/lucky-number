import Head from "next/head";

export default function Home({ data, error }) {
  return (
    <div className="container">
      <Head>
        <title>Current number</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div class="fullscreenDiv">
        <h2 className="center">
          {error ? error : `Current number: ${data.n}`}
        </h2>
      </div>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto,
            Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
            sans-serif;
        }

        .center {
          position: absolute;
          height: 50px;
          top: 50%;
          left: 50%;
          margin-left: -50px; /* margin is -0.5 * dimension */
          margin-top: -25px; 
        }​
      `}</style>
    </div>
  );
}

export async function getServerSideProps({ res, req, query }) {
  try {
    const resp = await fetch(
      "https://us-central1-luck-number-a679b.cloudfunctions.net/getNumber"
    );
    const data = await resp.json();
    return { props: { data } };
  } catch {
    return { props: { error: "Could not retrive the number!" } };
  }
}
