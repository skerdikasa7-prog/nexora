
import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card, CardContent, CardFooter, CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tabs, TabsContent, TabsList, TabsTrigger,
} from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import {
  Home, Search, User, Heart, MessageCircle,
  Image as ImageIcon, Hash, Send, Sun, Moon, MoreHorizontal, LogIn, LogOut, Settings, BadgeCheck,
} from "lucide-react";

const LS_KEYS = { posts: "nexora.posts.v1", user: "nexora.user.v1", theme: "nexora.theme.v1", pro: "nexora.pro.v1" };
const VERIFIED_THRESHOLD = 1_000_000;
const ADMIN_ACCOUNTS = [{ handle: "@skerdi", email: "skerdi7nexora.com", verified: true }];
function isVerified(u){ if(!u) return false; if(u.verified) return true; if((u.followers||0)>=VERIFIED_THRESHOLD) return true; return ADMIN_ACCOUNTS.some(a=>a.email===u.email||a.handle===u.handle); }

const sampleAvatars = [
  "https://images.unsplash.com/photo-1548142813-c348350df52b?q=80&w=200&auto=format&fit=facearea&facepad=3&h=200",
  "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?q=80&w=200&auto=format&fit=facearea&facepad=3&h=200",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=facearea&facepad=3&h=200",
  "https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=200&auto=format&fit=facearea&facepad=3&h=200",
];
const sampleImages = [
  "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1200&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop",
];

function uid(){ return Math.random().toString(36).slice(2)+Date.now().toString(36); }
function parseTags(text){ const tags=new Set(); (text||"").split(/\\s+/).filter(w=>w.startsWith("#")&&w.length>1).forEach(w=>tags.add(w.replace(/[^#\\w]/g,""))); return Array.from(tags); }
function timeAgo(ts){ const diff=Date.now()-ts; const s=Math.floor(diff/1000); if(s<60) return `${s}s`; const m=Math.floor(s/60); if(m<60) return `${m}m`; const h=Math.floor(m/60); if(h<24) return `${h}h`; const d=Math.floor(h/24); return `${d}g`; }

export default function App(){
  const [theme,setTheme]=useState(typeof window!=="undefined"?(localStorage.getItem(LS_KEYS.theme)||"dark"):"dark");
  const [pro,setPro]=useState(typeof window!=="undefined"?localStorage.getItem(LS_KEYS.pro)==="1":false);
  const [user,setUser]=useState(()=>{ if(typeof window==="undefined")return null; const raw=localStorage.getItem(LS_KEYS.user); return raw?JSON.parse(raw):null; });
  const [tab,setTab]=useState("home");
  const [posts,setPosts]=useState(()=>{ if(typeof window==="undefined")return []; const raw=localStorage.getItem(LS_KEYS.posts); if(raw) return JSON.parse(raw); return []; });

  useEffect(()=>{ document.documentElement.classList.toggle("dark",theme==="dark"); localStorage.setItem(LS_KEYS.theme,theme); },[theme]);
  useEffect(()=>{ localStorage.setItem(LS_KEYS.posts,JSON.stringify(posts)); },[posts]);
  useEffect(()=>{ if(user) localStorage.setItem(LS_KEYS.user,JSON.stringify(user)); },[user]);
  useEffect(()=>{ localStorage.setItem(LS_KEYS.pro", pro ? "1" : "0"); },[pro]);

  const trending=useMemo(()=>{ const counts=posts.flatMap(p=>p.tags).reduce((a,t)=>{a[t]=(a[t]||0)+1; return a;},{}); return Object.entries(counts).sort((a,b)=>b[1]-a[1]).slice(0,10); },[posts]);

  function handleCreatePost({text,imageDataUrl}){
    if(!text && !imageDataUrl){ toast("Scrivi qualcosa o carica un'immagine."); return; }
    const payload={ id:uid(), author:user||{name:"Guest",handle:"@guest",avatar:sampleAvatars[3]}, content:text, image:imageDataUrl||"", createdAt:Date.now(), likes:0, didLike:false, comments:[], tags:parseTags(text||"") };
    setPosts(p=>[payload,...p]); toast.success("Post pubblicato ✨");
  }
  function toggleLike(id){ setPosts(p=>p.map(post=>post.id===id?{...post,didLike:!post.didLike,likes:post.didLike?post.likes-1:post.likes+1}:post)); }
  function addComment(id,text){ if(!text) return; setPosts(p=>p.map(post=>post.id===id?{...post,comments:[...post.comments,{id:uid(),author:user||{name:"Guest",handle:"@guest",avatar:sampleAvatars[3]},text,createdAt:Date.now()}]}:post)); }

  const filtered=useMemo(()=>posts,[posts]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-zinc-100">
      <div className="mx-auto max-w-6xl grid grid-cols-12 gap-4 p-4">
        <aside className="hidden md:block col-span-3 sticky top-4 h-fit">
          <Brand user={user} setTab={setTab} />
          <Nav tab={tab} setTab={setTab} />
          <ProToggle pro={pro} setPro={setPro} />
          <ThemeToggle theme={theme} setTheme={setTheme} />
        </aside>

        <main className="col-span-12 md:col-span-6 space-y-4">
          <TopBarMobile tab={tab} setTab={setTab} theme={theme} setTheme={setTheme} />
          <AuthBanner user={user} setUser={setUser} />
          {(!pro) && <AdCard kind="banner" />}
          <Composer onCreate={handleCreatePost} />
          <Tabs value={tab} onValueChange={setTab} className="w-full">
            <TabsList className="grid grid-cols-3 gap-2">
              <TabsTrigger value="home" className="flex gap-2"><Home className="h-4 w-4"/> Home</TabsTrigger>
              <TabsTrigger value="explore" className="flex gap-2"><Search className="h-4 w-4"/> Esplora</TabsTrigger>
              <TabsTrigger value="profile" className="flex gap-2"><User className="h-4 w-4"/> Profilo</TabsTrigger>
            </TabsList>
            <TabsContent value="home" className="space-y-4">
              <Feed posts={filtered} onLike={toggleLike} onComment={addComment} pro={pro} />
            </TabsContent>
            <TabsContent value="explore" className="space-y-4">
              <Explore trending={trending} setTab={setTab} />
            </TabsContent>
            <TabsContent value="profile" className="space-y-4">
              <Profile user={user} setUser={setUser} posts={posts} />
            </TabsContent>
          </Tabs>
        </main>

        <aside className="hidden md:block col-span-3 sticky top-4 h-fit space-y-4">
          <SearchCard />
          <TrendsCard trending={trending} />
          {!pro && <AdCard kind="card" />}
          <TipsCard />
        </aside>
      </div>
    </div>
  );
}

function Brand(){ return (
  <div className="mb-4 flex items-center gap-3">
    <div className="p-2 rounded-2xl bg-zinc-900 text-zinc-100"><Hash className="h-6 w-6" /></div>
    <div><div className="text-xl font-bold text-lime-400">Nexora™</div><div className="text-xs text-zinc-400">Prototipo</div></div>
  </div>
);}

function Nav({ tab, setTab }){
  const items=[{key:"home",label:"Home",icon:Home},{key:"explore",label:"Esplora",icon:Search},{key:"profile",label:"Profilo",icon:User}];
  return (
    <Card className="mb-4"><CardContent className="p-2">
      <div className="grid gap-1">
        {items.map(it=>(
          <Button key={it.key} variant={tab===it.key?"default":"ghost"} className="justify-start gap-2" onClick={()=>setTab(it.key)}>
            <it.icon className="h-4 w-4" /> {it.label}
          </Button>
        ))}
      </div>
    </CardContent></Card>
  );
}

function ProToggle({pro,setPro}){
  return (
    <Card className="mb-4">
      <CardHeader className="pb-0 font-semibold">Monetizzazione</CardHeader>
      <CardContent className="pt-2">
        <div className="flex items-center justify-between"><span className="text-sm">Attiva PRO (rimuovi pubblicità)</span><Switch checked={pro} onCheckedChange={setPro} /></div>
        <p className="text-xs text-zinc-400 mt-2">Collega Stripe nella versione reale.</p>
      </CardContent>
    </Card>
  );
}

function ThemeToggle({theme,setTheme}){
  return (
    <Card><CardContent className="p-2 flex items-center justify-between">
      <div className="text-sm">Tema {theme==="dark"?"Scuro":"Chiaro"}</div>
      <Button variant="ghost" className="gap-2" onClick={()=>setTheme(theme==="dark"?"light":"dark")}>
        {theme==="dark"?<Sun className="h-4 w-4" />:<Moon className="h-4 w-4" />} Toggle
      </Button>
    </CardContent></Card>
  );
}

function TopBarMobile({tab,setTab,theme,setTheme}){
  return (
    <div className="md:hidden sticky top-0 z-20 backdrop-blur bg-black/60 border-b border-zinc-800">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-3">
        <div className="font-bold text-lime-400">Nexora™</div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={()=>setTab("home")}><Home className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon" onClick={()=>setTab("explore")}><Search className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon" onClick={()=>setTab("profile")}><User className="h-5 w-5" /></Button>
          <Button variant="ghost" size="icon" onClick={()=>setTheme(theme==="dark"?"light":"dark")}>
            {theme==="dark"?<Sun className="h-5 w-5" />:<Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>
    </div>
  );
}

function AuthBanner({user,setUser}){
  const [open,setOpen]=useState(false);
  const [name,setName]=useState(""); const [handle,setHandle]=useState(""); const [email,setEmail]=useState("");
  function signIn(){ if(!name||!handle){toast("Inserisci nome e handle (es. @skerdi)");return;} const avatar=sampleAvatars[Math.floor(Math.random()*sampleAvatars.length)]; const base={name,handle,email,avatar,followers:0}; const usr={...base,verified:isVerified(base)}; setUser(usr); setOpen(false); toast.success("Accesso effettuato ✅"); }
  function signOut(){ setUser(null); toast("Sei uscito dall'account."); }
  return (
    <Card><CardContent className="p-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <Avatar><AvatarImage src={user?.avatar} alt={user?.name||"Guest"} /><AvatarFallback>{(user?.name||"G").slice(0,2)}</AvatarFallback></Avatar>
        <div>
          <div className="font-semibold text-lg flex items-center gap-2">{user?user.name:"Ospite"} {user&&isVerified(user)&&<BadgeCheck className="h-5 w-5 text-lime-400" />}</div>
          <div className="text-xs text-zinc-400">{user?user.handle:"Accedi per postare con il tuo profilo"}</div>
        </div>
      </div>
      <div className="flex gap-2">
        {!user ? (
          <>
            <Button className="gap-2" onClick={()=>setOpen(true)}><LogIn className="h-4 w-4"/>Accedi</Button>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogContent>
                <DialogHeader><DialogTitle>Crea il tuo profilo</DialogTitle><DialogDescription>Nome, email (opzionale) e handle (es. @skerdi)</DialogDescription></DialogHeader>
                <div className="grid gap-3">
                  <Input placeholder="Nome" value={name} onChange={e=>setName(e.target.value)} />
                  <Input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
                  <Input placeholder="@handle" value={handle} onChange={e=>setHandle(e.target.value)} />
                  <Button onClick={signIn} className="gap-2"><LogIn className="h-4 w-4"/>Entra</Button>
                </div>
              </DialogContent>
            </Dialog>
          </>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="secondary" className="gap-2"><MoreHorizontal className="h-4 w-4"/>Opzioni</Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem className="gap-2"><Settings className="h-4 w-4"/>Impostazioni</DropdownMenuItem>
              <DropdownMenuItem className="gap-2" onClick={signOut}><LogOut className="h-4 w-4"/>Esci</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </CardContent></Card>
  );
}

function Composer({onCreate}){
  const [text,setText]=useState(""); const [imgUrl,setImgUrl]=useState(""); const [fileName,setFileName]=useState(""); const fileRef=useRef(null);
  function handleFile(e){ const file=e.target.files?.[0]; if(!file) return; const reader=new FileReader(); reader.onload=ev=>setImgUrl(String(ev.target?.result||"")); reader.readAsDataURL(file); setFileName(file.name); }
  function submit(){ onCreate({text:text.trim(), imageDataUrl:imgUrl}); setText(""); setImgUrl(""); setFileName(""); if(fileRef.current) fileRef.current.value=""; }
  return (
    <Card><CardContent className="p-4 space-y-3">
      <Textarea value={text} onChange={e=>setText(e.target.value)} placeholder="Cosa stai pensando? Usa #hashtag per i trend…" className="min-h-[80px]" />
      {imgUrl && (<div className="relative"><img src={imgUrl} alt="preview" className="rounded-2xl w-full object-cover" /><div className="mt-1 text-xs text-zinc-400">{fileName||"Immagine tramite URL"}</div></div>)}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex gap-2">
          <Button variant="secondary" className="gap-2" onClick={()=>fileRef.current?.click()}><ImageIcon className="h-4 w-4"/> Carica</Button>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={handleFile} />
          <Input placeholder="oppure incolla URL immagine…" value={imgUrl.startsWith("data:")?"":imgUrl} onChange={e=>setImgUrl(e.target.value)} className="w-64" />
        </div>
        <Button onClick={submit} className="gap-2"><Send className="h-4 w-4"/> Pubblica</Button>
      </div>
    </CardContent></Card>
  );
}

function Feed({posts,onLike,onComment,pro}){
  return (
    <div className="space-y-4">
      <AnimatePresence>
        {posts.map((p,i)=>(
          <motion.div key={p.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-10}} transition={{duration:0.2}}>
            <PostCard post={p} onLike={onLike} onComment={onComment} />
            {!pro && (i+1)%4===0 ? <AdCard kind="inline" /> : null}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function PostCard({post,onLike,onComment}){
  const [comment,setComment]=useState("");
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-3">
          <Avatar><AvatarImage src={post.author.avatar} /><AvatarFallback>{post.author.name.slice(0,2)}</AvatarFallback></Avatar>
          <div className="leading-tight">
            <div className="font-semibold flex items-center gap-1">{post.author.name}{isVerified(post.author)&&<BadgeCheck className="h-4 w-4 text-lime-400" />}</div>
            <div className="text-xs text-zinc-400">{post.author.handle} · {timeAgo(post.createdAt)}</div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="whitespace-pre-wrap text-[15px]">{post.content}</div>
        {post.tags?.length ? (<div className="flex flex-wrap gap-2">{post.tags.map(t=>(<Badge key={t} variant="secondary" className="text-xs">{t}</Badge>))}</div>) : null}
        {post.image ? (<img src={post.image} alt="media" className="rounded-2xl w-full object-cover" />) : null}
      </CardContent>
      <CardFooter className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="gap-2" onClick={()=>onLike(post.id)}><Heart className={`h-4 w-4 ${post.didLike?"fill-red-500 stroke-red-500":""}`} /> {post.likes}</Button>
          <div className="text-sm text-zinc-400 flex items-center gap-1"><MessageCircle className="h-4 w-4"/> {post.comments.length}</div>
        </div>
        <div className="flex items-center gap-2 w-full">
          <Input placeholder="Scrivi un commento…" value={comment} onChange={e=>setComment(e.target.value)} onKeyDown={e=>{ if(e.key==="Enter"){ onComment(post.id, comment.trim()); setComment(""); } }} />
          <Button size="sm" onClick={()=>{ onComment(post.id, comment.trim()); setComment(""); }}>Invia</Button>
        </div>
        {post.comments.length ? (<div className="w-full space-y-2 pt-2">{post.comments.map(c=>(<div key={c.id} className="text-sm"><span className="font-medium">{c.author.name}</span>{" "}<span className="text-zinc-400">{c.text}</span></div>))}</div>) : null}
      </CardFooter>
    </Card>
  );
}

function Explore({trending}){
  return (
    <Card><CardHeader><div className="font-semibold flex items-center gap-2"><Hash className="h-4 w-4"/> Trend</div></CardHeader>
      <CardContent className="space-y-2">
        {trending.length ? trending.map(([tag,n])=>(
          <div key={tag} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2"><Badge variant="secondary">{tag}</Badge><span className="text-zinc-400">{n} post</span></div>
          </div>
        )) : (<div className="text-sm text-zinc-400">Nessun trend ancora. Inizia a postare! ✨</div>)}
      </CardContent></Card>
  );
}

function Profile({user,setUser,posts}){
  const mine=useMemo(()=>posts.filter(p=>(user?p.author.handle===user.handle:p.author.handle==="@guest")),[posts,user]);
  const [bio,setBio]=useState(user?.bio||"Ciao! Questa è la mia bio su Nexora.");
  useEffect(()=>{ if(user) setUser({...user,bio}); },[bio]);
  return (
    <div className="space-y-4">
      <Card><CardContent className="p-4 flex items-center gap-4">
        <Avatar className="h-16 w-16"><AvatarImage src={user?.avatar} /><AvatarFallback>{(user?.name||"G").slice(0,2)}</AvatarFallback></Avatar>
        <div className="flex-1">
          <div className="font-semibold text-lg flex items-center gap-2">{user?user.name:"Ospite"} {user&&isVerified(user)&&<BadgeCheck className="h-5 w-5 text-lime-400" />}</div>
          <div className="text-sm text-zinc-400">{user?user.handle:"@guest"}</div>
          <Textarea value={bio} onChange={e=>setBio(e.target.value)} className="mt-2" />
        </div>
      </CardContent></Card>
      <div className="space-y-2">
        <div className="font-semibold">I miei post</div>
        {mine.length ? mine.map(p=>(<PostCard key={p.id} post={p} onLike={()=>{}} onComment={()=>{}} />)) : (<Card><CardContent className="p-4 text-sm text-zinc-400">Ancora nessun post.</CardContent></Card>)}
      </div>
    </div>
  );
}

function SearchCard(){ return (<Card><CardContent className="p-3 flex items-center gap-2"><Search className="h-4 w-4"/><Input placeholder="Cerca persone, tag, post…" /></CardContent></Card>); }
function TrendsCard({trending}){ return (<Card><CardHeader className="pb-2 font-semibold">Tendenze per te</CardHeader><CardContent className="space-y-2">{trending.length?trending.map(([tag,n])=>(<div key={tag} className="flex items-center justify-between text-sm"><div className="flex items-center gap-2"><Badge variant="secondary">{tag}</Badge></div><span className="text-zinc-400">{n} post</span></div>)):(<div className="text-sm text-zinc-400">Ancora nessun trend.</div>)}</CardContent></Card>); }
function TipsCard(){ return (<Card><CardHeader className="pb-2 font-semibold">Suggerimenti</CardHeader><CardContent className="space-y-2 text-sm"><div>• Scrivi post con #hashtag per comparire in Esplora.</div><div>• Carica foto direttamente o incolla un URL.</div><div>• Attiva PRO per rimuovere la pubblicità (demo).</div></CardContent></Card>); }
function AdCard({kind="card"}){ const content=(<div className="rounded-2xl border border-zinc-800 p-4 bg-gradient-to-r from-zinc-900 to-black"><div className="text-xs uppercase tracking-wide text-zinc-400">Annuncio</div><div className="mt-1 font-semibold">Scopri SceneBuilder™ PRO</div><div className="text-sm text-zinc-400">Crea scene in stile cartoon. Upgrade per sbloccare contenuti extra.</div><div className="mt-2"><Button size="sm">Scopri</Button></div></div>); if(kind==="banner") return <div>{content}</div>; if(kind==="inline") return <div className="my-3">{content}</div>; return (<Card><CardContent className="p-0">{content}</CardContent></Card>); }
