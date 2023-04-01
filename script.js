const loadData = async (url) => {
  const res = await fetch(url);

  const csvBlob = await res.blob();
  const blobText = await csvBlob.text();

  const lines = blobText.split("\r\n").map((d) => d.split(","));

  const headers = [...lines[0]].splice(1);
  const data = [...lines].splice(1);

  const datasets = headers.map((h, i) => ({
    label: h,
    data: data.map((d) => d[i + 1])
  }));
  // Some formatting to parse this:
  // 2023-03-29 22:39:39.013561
  const axisLabels = data.map(
    (l) => l[0].split(" ").join("T")
    // luxon.DateTime.fromISO(l[0].split(" ").join("T"), {
    //   zone: "Europe/Amsterdam"
    // })
  );
  return { axisLabels, datasets };
};

document.addEventListener("DOMContentLoaded", async () => {
  const { axisLabels, datasets } = await loadData(
    "https://gateway.ipfs.io/ipfs/QmQNExCQ4VXKNJkTVTWUeFA5mDKyvJ2CFfB6LnXit3WqNL/data/garden-data.csv"
  );

  // Create chart
  const ctx = document.getElementById("gardenChart");

  new Chart(ctx, {
    type: "line",
    data: {
      labels: axisLabels,
      datasets: datasets
    },
    options: {
      interaction: {
        mode: "nearest",
        axis: "x",
        intersect: false
      },
      elements: {
        point: {
          radius: 0
        },
        line: {
          borderWidth: 1
        }
      },

      scales: {
        x: {
          type: "time",
          min: "2023-03-29T22:39:39.013561",
          time: {
            unit: "minute",
            tooltipFormat: "DD T",
            displayFormats: {
              day: "DD T",
              minute: "DD T"
            }
          }
        }
      }
    }
  });
});
