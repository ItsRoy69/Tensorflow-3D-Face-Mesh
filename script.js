let model;
let webcam;
const webcamElement = document.getElementById("webcam");
let capturing = false;

async function capture() {
    capturing = true;

    while (capturing) {
        const img = await webcam.capture();
        const predictions = await model.estimateFaces(img);

        if (predictions.length > 0) {
            const a = [];
            const b = [];
            const c = [];
            
            predictions.forEach(prediction => {
                const keypoints = prediction.mesh;
                // log facial keypoints.
                keypoints.forEach(keypoint => {
                    const [x, y, z] = keypoint;
                    a.push(y);
                    b.push(x);
                    c.push(z);
                });
            });

            // Plotting the mesh
            const data = [
                {
                    opacity: 0.8,
                    color: 'rgb(300,100,200)',
                    type: 'mesh3d',
                    x: a,
                    y: b,
                    z: c,
                }
            ];
            Plotly.newPlot('plot', data);
        }
    }
}

async function main() {
    // load the MediaPipe facemesh model.
    model = await facemesh.load();
    console.log("Model loaded");

    webcam = await tf.data.webcam(webcamElement);
    const imgtemp = await webcam.capture();
    imgtemp.dispose();

    document.getElementById("capture").addEventListener("click", () => {
        capture();
    });

    document.getElementById("stop").addEventListener("click", () => {
        capturing = false;
    });
}

main();
