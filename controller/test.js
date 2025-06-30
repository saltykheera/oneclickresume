const stream=require("stream")
const nodelatex=require("node-latex")
const fs=require('fs')
const {upload}=require('./uploader')


const latexContent="\\documentclass{article}\n\\usepackage[utf8]{inputenc}\n\n\\title{My Simple LaTeX Document}\n\\author{Your Name}\n\\date{June 27, 2025}\n\n\\begin{document}\n\\maketitle\n\nHello, world! This is a simple document created from LaTeX.\n\nHere's a list:\n\\begin{itemize}\n    \\item Item 1\n    \\item Item 2\n\\end{itemize}\n\n\\end{document}"


const pdfstream=nodelatex(latexContent)
chunks=[]
pdfstream.on('data',(dataBit)=>{
    chunks.push(dataBit)
})
pdfstream.on('end',async ()=>{
    const buffer=Buffer.concat(chunks)
    try{
        await upload(buffer,'crazy.pdf')
    }catch(err){
        console.log('error',err)
    }
    console.log(chunks.length)
    console.log(chunks)
})

pdfstream.on('error',()=>{
    console.log('compilation error')
})


