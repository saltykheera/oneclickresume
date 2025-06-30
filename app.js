const express =require('express')
const latex=require('node-latex')
const path=require('path')
const fs=require('fs')
require('dotenv').config();

const {downloadPrivateFileById}=require('./controller/downloader')

const latexController=require('./controller/converter');
const { convertl2p } = require('./controller/convert');

const app=express()
const port=3000

app.use(express.json())

// app.post('/convert',latexController.handleLatexConversion)

app.get('/download/:fileid',async (req,res)=>{
    const {fileid}=req.params;
    await downloadPrivateFileById(fileid,res)

})

app.post('/convert',async (req,res)=>{
    const {data,fileName}=req.body
    await convertl2p(data,fileName,res);

})


app.listen(port, () => {
    console.log(`LaTeX to PDF API listening at http://localhost:${port}`);
    console.log('To test: POST LaTeX content to /convert endpoint.');
});