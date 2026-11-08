(function(){
  const $=id=>document.getElementById(id);
  let client=null;
  function message(s,isError=true){const el=$('loginMessage');if(el){el.textContent=s;el.className=isError?'error':'success';}}
  function unlock(session){
    document.body.classList.remove('rv-auth-pending');
    const who=$('rv-user-email');if(who)who.textContent=session?.user?.email||'Signed in';
    window.RV_AUTH_USER=session?.user||null;
    window.dispatchEvent(new CustomEvent('rv-auth-ready',{detail:{user:session?.user||null}}));
  }
  function lock(){document.body.classList.add('rv-auth-pending');window.RV_AUTH_USER=null;}
  async function start(){
    lock();
    if(!window.supabase||!window.RV_SUPABASE_URL||!window.RV_SUPABASE_PUBLISHABLE_KEY){
      message('Secure login service could not load. Check your internet connection and refresh.');return;
    }
    client=window.supabase.createClient(window.RV_SUPABASE_URL,window.RV_SUPABASE_PUBLISHABLE_KEY,{
      auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}
    });
    window.RV_SUPABASE=client;
    const {data,error}=await client.auth.getSession();
    if(error){message(error.message);return;}
    if(data.session){unlock(data.session);return;}
    $('loginForm').addEventListener('submit',async e=>{
      e.preventDefault();
      const btn=$('loginSubmit');btn.disabled=true;btn.textContent='Signing in…';message('',false);
      const email=$('loginEmail').value.trim(),password=$('loginPassword').value;
      const result=await client.auth.signInWithPassword({email,password});
      btn.disabled=false;btn.textContent='Sign in';
      if(result.error){message(result.error.message);return;}
      unlock(result.data.session);
    });
  }
  document.addEventListener('DOMContentLoaded',()=>{
    const out=$('rv-logout');if(out)out.addEventListener('click',async()=>{
      if(!confirm('Sign out of Rail verse signalling works?'))return;
      const {error}=await client.auth.signOut();if(error){alert(error.message);return;}
      lock();message('You have been signed out.',false);$('loginPassword').value='';
    });
    start();
  });
  if(window.supabase?.auth?.onAuthStateChange){
    // Auth state is also updated for token refresh and sign-out events.
  }
})();