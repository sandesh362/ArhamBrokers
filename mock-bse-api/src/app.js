import express from 'express';
import cors from 'cors';

const clients=['Client Alpha','Client Bharat','Client Capital','Client Delta','Client Evergreen','Client Frontier'];
const symbols=['RELIANCE','TCS','INFY','HDFCBANK','ICICIBANK','SBIN','ITC','LT','BHARTIARTL','MARUTI'];
export function createTrades(count=3000){return Array.from({length:count},(_,i)=>({tradeId:`TRD-${String(i+1).padStart(6,'0')}`,client:clients[i%clients.length],symbol:symbols[i%symbols.length],quantity:((i*37)%900+1)*10,price:Number((110+((i*791)%240000)/100).toFixed(2)),timestamp:new Date(Date.UTC(2026,0,1,3,45,i*17)).toISOString()}));}
export function createApp(options={}) {
 const trades=createTrades(options.seedCount??Number(process.env.MOCK_SEED_COUNT||3000));
 const totalDelay=Math.max(0,Number(options.totalDelayMs??(process.env.MOCK_TOTAL_DELAY_MS||5000)));
 const maxDelay=Number(options.maxRequestDelayMs??(process.env.MOCK_MAX_REQUEST_DELAY_MS||25000));
 const app=express(); app.use(cors());
 app.get('/',(_q,res)=>res.json({service:'Mock BSE Exchange API',status:'ok',endpoints:{health:'/health',trades:'/getTrades?limit=100&offset=0'}}));
 app.get('/health',(req,res)=>res.json({status:'ok',records:trades.length}));
 app.get('/getTrades',async(req,res,next)=>{try{const limit=Number(req.query.limit??process.env.MOCK_PAGE_SIZE??100),offset=Number(req.query.offset??0); if(!Number.isInteger(limit)||limit<1||limit>500||!Number.isInteger(offset)||offset<0)return res.status(400).json({error:{code:'INVALID_PAGINATION',message:'limit must be 1-500 and offset must be non-negative'}}); const pages=Math.max(1,Math.ceil(trades.length/limit));const delay=Math.ceil(totalDelay/pages); if(delay>=maxDelay||delay>=30000)return res.status(422).json({error:{code:'UNSAFE_DELAY',message:'Configured per-request delay must remain below 30 seconds'}}); if(delay)await new Promise(r=>setTimeout(r,delay));const data=trades.slice(offset,offset+limit);res.json({data,pagination:{limit,offset,total:trades.length,returned:data.length,hasMore:offset+data.length<trades.length,nextOffset:offset+data.length<trades.length?offset+data.length:null}})}catch(e){next(e)}});
 app.use((err,req,res,next)=>res.status(500).json({error:{code:'INTERNAL_ERROR',message:'Mock exchange failed'}})); return app;
}
