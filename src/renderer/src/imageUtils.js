export async function copySvgToClipboard(svgString) {
  //   const svgString = serializeSvg(svgElement)
  const pngBlob = await convertSvgToPngBlob(svgString);
  await copyPngToClipboard(pngBlob);
}

function getSvgAspectRatio(svgString) {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, "image/svg+xml");
  const svgElement = svgDoc.documentElement;

  const width = parseFloat(svgElement.getAttribute("width"));
  const height = parseFloat(svgElement.getAttribute("height"));

  if (isNaN(width) || isNaN(height)) {
    throw new Error("Invalid SVG dimensions");
  }

  return width / height;
}

async function convertSvgToPngBlob(svgString) {
  // Create a Blob from the SVG string
  const svgBlob = new Blob([svgString], {
    type: "image/svg+xml;charset=utf-8",
  });
  const blobUrl = URL.createObjectURL(svgBlob);
  const aspectRatio = getSvgAspectRatio(svgString);

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        // Create a canvas with the same dimensions as your SVG
        const canvas = document.createElement("canvas");
        // You might want to parse width/height from your SVG or set them explicitly
        const height = 1000; // set your desired height here
        const width = height * aspectRatio; // set your desired width here
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);

        // Convert canvas to Blob
        canvas.toBlob((pngBlob) => {
          if (pngBlob) {
            resolve(pngBlob);
          } else {
            reject(new Error("Canvas is empty"));
          }
        }, "image/png");
      } catch (err) {
        reject(err);
      }
    };
    img.onerror = (e) => reject(e);

    // Start loading the image
    img.src = blobUrl;
  });
}

async function copyPngToClipboard(pngBlob) {
  // 'ClipboardItem' is part of the new Clipboard API
  const clipboardItem = new ClipboardItem({ "image/png": pngBlob });
  await navigator.clipboard.write([clipboardItem]);
}
