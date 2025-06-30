const express = require('express');
const path = require('path');
const fs = require('fs');
const latex = require('node-latex');

const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Define a directory for temporary files
const tempDir = path.join(__dirname, 'temp');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

app.post('/convert', async (req, res) => {
    const { latexContent } = req.body;

    if (!latexContent) {
        return res.status(400).send('Please provide LaTeX content in the request body.');
    }

    const inputFilePath = path.join(tempDir, `input_${Date.now()}.tex`);
    const outputFilePath = path.join(tempDir, `output_${Date.now()}.pdf`);

    try {
        // 1. Write the LaTeX content to a temporary .tex file
        await fs.promises.writeFile(inputFilePath, latexContent);

        // 2. Create a read stream from the .tex file
        const input = fs.createReadStream(inputFilePath);
        // 3. Create a write stream for the output .pdf file
        const output = fs.createWriteStream(outputFilePath);

        // 4. Compile LaTeX to PDF
        const pdf = latex(input);

        pdf.pipe(output);

        output.on('finish', () => {
            // 5. Send the generated PDF as a response
            res.status(200).json({result:"done"})
            // res.sendFile(outputFilePath, (err) => {
            //     if (err) {
            //         console.error('Error sending file:', err);
            //         res.status(500).send('Error sending PDF.');
            //     }
            //     // 6. Clean up temporary files
            //     fs.unlink(inputFilePath, (unlinkErr) => {
            //         if (unlinkErr) console.error('Error deleting input file:', unlinkErr);
            //     });
            //     fs.unlink(outputFilePath, (unlinkErr) => {
            //         if (unlinkErr) console.error('Error deleting output file:', unlinkErr);
            //     });
            // });
        });

        pdf.on('error', (err) => {
            console.error('LaTeX compilation error:', err);
            res.status(500).send('Failed to compile LaTeX to PDF. Check your LaTeX content.');
            // Clean up in case of error as well
            fs.unlink(inputFilePath, (unlinkErr) => {
                if (unlinkErr) console.error('Error deleting input file on error:', unlinkErr);
            });
            fs.unlink(outputFilePath, (unlinkErr) => {
                if (unlinkErr) console.error('Error deleting output file on error:', unlinkErr);
            });
        });

    } catch (error) {
        console.error('Server error:', error);
        res.status(500).send('An unexpected server error occurred.');
        // Clean up in case of other errors
        fs.unlink(inputFilePath, (unlinkErr) => {
            if (unlinkErr) console.error('Error deleting input file on catch:', unlinkErr);
        });
        fs.unlink(outputFilePath, (unlinkErr) => {
            if (unlinkErr) console.error('Error deleting output file on catch:', unlinkErr);
        });
    }
});

app.listen(port, () => {
    console.log(`LaTeX to PDF API listening at http://localhost:${port}`);
});