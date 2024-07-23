const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const imagesDir = path.join(__dirname, "images");
const galleryDir = path.join(__dirname, "gallery");

if (!fs.existsSync(galleryDir)) {
  fs.mkdirSync(galleryDir);
}

rl.question("Rasm nomini kiriting (misol: image1.jpg): ", (fileName) => {
  const imagePath = path.join(imagesDir, fileName);

  if (fs.existsSync(imagePath)) {
    const destPath = path.join(galleryDir, fileName);
    const readStream = fs.createReadStream(imagePath);
    const writeStream = fs.createWriteStream(destPath);

    readStream.pipe(writeStream);

    writeStream.on("finish", () => {
      console.log(`${fileName} nusxasi olingan`);
      updateHTML(fileName);
      rl.close();
    });
  } else {
    console.log("Bunday rasm yo'q");
    rl.close();
  }
});

function updateHTML(fileName) {
  const galleryHTMLPath = path.join(__dirname, "gallery.html");

  fs.readFile(galleryHTMLPath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return;
    }

    const updatedData = data.replace(
      "</body>",
      `<img src="gallery/${fileName}" alt="${fileName}">\n</body>`
    );

    fs.writeFile(galleryHTMLPath, updatedData, "utf8", (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("gallery.html yangilandi");
    });
  });
}
