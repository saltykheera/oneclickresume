const nodelatex=require('node-latex');
const {upload}=require('./uploader');
const { response } = require('express');

async function convertl2p(data,fileName,res) {
    const pdfstream=nodelatex(data)
    const chunks=[]
    pdfstream.on('data',(databit)=>{
        chunks.push(databit)
    })
    pdfstream.on('end',async ()=>{
        const buffer=Buffer.concat(chunks)
        try{
            await upload(buffer,fileName).then(()=>{
                res.status(200).json(
                    {response:"fileuploaded"}
                )
            })
            
        }catch(err){
            console.log('error',err)
        }
    })
    pdfstream.on('error',()=>{
        console.log('compilation error latex 2 pdf')
    })
}


module.exports={convertl2p}


