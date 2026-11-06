package com.cactusverse.lginstaller;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.ColorStateList;
import android.database.Cursor;
import android.graphics.Color;
import android.net.Uri;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.provider.OpenableColumns;
import android.text.InputType;
import android.util.Base64;
import android.view.View;
import android.widget.*;
import com.jcraft.jsch.*;
import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Locale;
import java.util.concurrent.*;

public class MainActivity extends Activity {
  private final int bg=Color.rgb(23,20,18), surface=Color.rgb(42,35,29),
                    ink=Color.rgb(245,229,210), muted=Color.rgb(192,165,140),
                    accent=Color.rgb(222,171,116);
  private EditText hostInput,passInput;
  private TextView status,fileName;
  private Button pairButton,pickButton,installButton;
  private Uri file;
  private String selectedName="";
  private long selectedBytes=-1L;
  private volatile byte[] currentKey;
  private final Handler main=new Handler(Looper.getMainLooper());
  private final ExecutorService background=Executors.newSingleThreadExecutor();
  private SharedPreferences prefs;
  private boolean busy=false;

  @Override public void onCreate(Bundle saved) {
    super.onCreate(saved);
    prefs=getSharedPreferences("lg_pairings",MODE_PRIVATE);
    getWindow().setStatusBarColor(bg);
    getWindow().setNavigationBarColor(bg);
    buildUi();
  }

  private int dp(int v) { return (int)(getResources().getDisplayMetrics().density*v+0.5f); }
  private TextView label(String value,int size,int color) {
    TextView t=new TextView(this);
    t.setText(value);t.setTextSize(size);t.setTextColor(color);
    t.setPadding(0,dp(5),0,dp(5));return t;
  }
  private Button button(String value){
    Button b=new Button(this);
    b.setText(value);b.setTextColor(bg);b.setAllCaps(false);
    b.setBackgroundTintList(ColorStateList.valueOf(accent));return b;
  }
  private void add(LinearLayout p,View v,int bottom){
    LinearLayout.LayoutParams lp=new LinearLayout.LayoutParams(-1,-2);
    lp.bottomMargin=dp(bottom);p.addView(v,lp);
  }
  private LinearLayout card(LinearLayout root){
    LinearLayout l=new LinearLayout(this);
    l.setOrientation(LinearLayout.VERTICAL);
    l.setPadding(dp(15),dp(14),dp(15),dp(14));
    l.setBackgroundColor(surface);
    add(root,l,dp(3));return l;
  }
  private void buildUi(){
    ScrollView scroll=new ScrollView(this);scroll.setBackgroundColor(bg);
    LinearLayout root=new LinearLayout(this);root.setOrientation(LinearLayout.VERTICAL);
    root.setPadding(dp(18),dp(20),dp(18),dp(28));scroll.addView(root);
    add(root,label("🌵  CACTUS TV",27,accent),0);
    add(root,label("INSTALLER LG webOS · BETA 0.1.1",12,muted),8);
    add(root,label("Instala archivos .ipk desde tu celular Android en un LG con Developer Mode. Sin PC y sin root.",15,ink),12);
    LinearLayout step1=card(root);
    add(step1,label("01  PREPARA EL TELEVISOR",16,accent),5);
    add(step1,label("Dev Mode Status: ON  ·  Key Server: ON\nConecta LG y celular a la misma red Wi-Fi. Mantén abierta la pantalla Developer Mode.",13,ink),3);
    LinearLayout step2=card(root);
    add(step2,label("02  CONECTAR AL LG",16,accent),5);
    hostInput=new EditText(this);
    hostInput.setSingleLine(true);hostInput.setTextColor(ink);
    hostInput.setHintTextColor(muted);hostInput.setHint("IP del LG: 192.168.x.x");
    hostInput.setInputType(InputType.TYPE_CLASS_PHONE);
    hostInput.setText(prefs.getString("last_ip",""));
    add(step2,hostInput,7);
    passInput=new EditText(this);passInput.setSingleLine(true);
    passInput.setTextColor(ink);passInput.setHintTextColor(muted);
    passInput.setHint("Passphrase del LG (6 caracteres)");
    passInput.setInputType(InputType.TYPE_CLASS_TEXT|InputType.TYPE_TEXT_VARIATION_PASSWORD);
    add(step2,passInput,7);
    pairButton=button("Conectar / emparejar LG");add(step2,pairButton,4);
    pairButton.setOnClickListener(v->pair());
    status=label("Pulsa Conectar para comprobar la comunicación con tu LG.",14,ink);
    status.setMinHeight(dp(58));
    add(step2,status,8);
    Button forget=button("Olvidar confianza SSH");add(step2,forget,0);
    forget.setOnClickListener(v->forgetHost());
    LinearLayout step3=card(root);
    add(step3,label("03  INSTALAR ARCHIVO IPK",16,accent),5);
    add(step3,label("Selecciona un .ipk autorizado guardado en el celular. No se descargan apps ni paquetes automáticamente.",13,muted),6);
    pickButton=button("Seleccionar archivo .ipk");add(step3,pickButton,5);
    pickButton.setOnClickListener(v->pickFile());
    fileName=label("No has seleccionado un archivo",13,ink);add(step3,fileName,7);
    installButton=button("Instalar en LG");installButton.setEnabled(false);
    add(step3,installButton,3);installButton.setOnClickListener(v->install());
    add(root,label("Proyecto experimental independiente. LG webOS Developer Mode puede caducar. La passphrase no se guarda.",11,muted),0);
    setContentView(scroll);
  }
  private void say(String s){main.post(()->{
    status.setText(s);
    boolean error=s.startsWith("No se")||s.startsWith("Error")||s.contains("no responde")||s.contains("inválida");
    status.setTextColor(error?Color.rgb(255,169,151):ink);
  });}
  private void working(boolean w){
    busy=w;
    main.post(()->{
      pairButton.setText(w?"Conectando con LG...":"Conectar / emparejar LG");
      pairButton.setEnabled(!w);pickButton.setEnabled(!w);
      hostInput.setEnabled(!w);passInput.setEnabled(!w);
      installButton.setEnabled(!w&&file!=null&&currentKey!=null);
    });
  }
  private void launch(Runnable task){
    if(busy)return;
    working(true);
    background.submit(()->{try{task.run();}finally{working(false);}});
  }
  private String host() throws Exception {
    String h=hostInput.getText().toString().trim();
    String[] b=h.split("\\.");
    if(b.length!=4)throw new Exception("Escribe la IP del LG como 192.168.1.25.");
    int[] n=new int[4];for(int i=0;i<4;i++){
      if(!b[i].matches("[0-9]{1,3}"))throw new Exception("La IP tiene caracteres inválidos.");
      n[i]=Integer.parseInt(b[i]);if(n[i]>255)throw new Exception("IP inválida.");}
    if(!(n[0]==10||(n[0]==172&&n[1]>=16&&n[1]<=31)||(n[0]==192&&n[1]==168)))
      throw new Exception("La IP debe ser privada y de tu red local.");
    return h;
  }
  // Legacy webOS Key Server implements a very small HTTP/1.0 endpoint.
  // Standard HttpURLConnection may send HTTP/1.1 and fail on older firmware.
  private byte[] keyFromTv(String h) throws Exception {
    say("Solicitando clave a LG por el puerto 9991...");
    try(Socket socket=new Socket()) {
      socket.connect(new InetSocketAddress(h,9991),6500);
      socket.setSoTimeout(8500);
      String request="GET /webos_rsa HTTP/1.0\r\nHost: "+h+"\r\nConnection: close\r\n\r\n";
      socket.getOutputStream().write(request.getBytes(StandardCharsets.US_ASCII));
      socket.getOutputStream().flush();
      ByteArrayOutputStream raw=new ByteArrayOutputStream();
      byte[] buf=new byte[4096];
      int n;
      while((n=socket.getInputStream().read(buf))!=-1) {
        raw.write(buf,0,n);
        if(raw.size()>65536)throw new IOException("La respuesta de Key Server es demasiado grande.");
      }
      String reply=raw.toString("US-ASCII");
      String body=reply;
      if(reply.startsWith("HTTP/")) {
        String first=reply.split("\\r?\\n",2)[0];
        if(!first.contains(" 200 "))throw new IOException("Key Server respondió: "+first);
        int cut=reply.indexOf("\r\n\r\n");
        int offset=4;
        if(cut<0){cut=reply.indexOf("\n\n");offset=2;}
        if(cut<0)throw new IOException("Key Server devolvió una respuesta incompleta.");
        body=reply.substring(cut+offset);
      }
      body=body.trim()+"\n";
      if(!body.contains("-----BEGIN ")||!body.contains("PRIVATE KEY-----"))
        throw new IOException("Key Server no devolvió una clave SSH válida. Comprueba el modo desarrollador.");
      return body.getBytes(StandardCharsets.US_ASCII);
    } catch(SocketTimeoutException e) {
      throw new IOException("El LG no respondió en el puerto 9991. Revisa IP, Wi-Fi y Key Server ON.",e);
    } catch(ConnectException e) {
      throw new IOException("Conexión rechazada en el puerto 9991. Revisa que Key Server esté activado y la IP sea la del LG.",e);
    }
  }
  private String shaFingerprint(byte[] raw) throws Exception {
    byte[] hash=MessageDigest.getInstance("SHA-256").digest(raw);
    return "SHA256:"+Base64.encodeToString(hash,Base64.NO_WRAP|Base64.NO_PADDING);
  }
  /** Certificate pinning / TOFU BEFORE SSH authentication. A mismatch is rejected. */
  private HostKeyRepository trustFor(String ip) {
    return new HostKeyRepository(){
      public int check(String ignored,byte[] hostKey){
        try {
          String finger=shaFingerprint(hostKey);
          String saved=prefs.getString("pin_"+ip,"");
          if(!saved.isEmpty())return saved.equals(finger)?OK:CHANGED;
          CountDownLatch done=new CountDownLatch(1);
          final boolean[] accepted={false};
          main.post(()->new AlertDialog.Builder(MainActivity.this)
            .setTitle("Confirmar identidad de tu LG")
            .setMessage("IP local: "+ip+"\n\nHuella SSH del televisor:\n"+finger+
              "\n\nAcepta solo si esta dirección corresponde a tu LG. Se guardará la huella para detectar cambios posteriores.")
            .setCancelable(false)
            .setPositiveButton("Confiar en este LG",(d,w)->{accepted[0]=true;done.countDown();})
            .setNegativeButton("Cancelar",(d,w)->done.countDown())
            .show());
          if(!done.await(75,TimeUnit.SECONDS)||!accepted[0])return NOT_INCLUDED;
          prefs.edit().putString("pin_"+ip,finger).commit();
          return OK;
        }catch(Exception ex){return NOT_INCLUDED;}
      }
      public void add(HostKey k,UserInfo u){}
      public void remove(String h,String t){}
      public void remove(String h,String t,byte[] k){}
      public String getKnownHostsRepositoryID(){return "CactusTV-LG-TrustedHosts";}
      public HostKey[] getHostKey(){return new HostKey[0];}
      public HostKey[] getHostKey(String h,String t){return new HostKey[0];}
    };
  }
  private Session connect(String h,byte[] key,String pass) throws Exception {
    JSch ssh=new JSch();
    ssh.setHostKeyRepository(trustFor(h));
    ssh.addIdentity("LG-webOS-Developer",key,null,pass.getBytes(StandardCharsets.UTF_8));
    Session session=ssh.getSession("prisoner",h,9922);
    session.setConfig("StrictHostKeyChecking","yes");
    session.setConfig("PreferredAuthentications","publickey");
    session.setServerAliveInterval(12000);
    session.connect(14000);
    return session;
  }
  private String pass() throws Exception {
    String s=passInput.getText().toString().trim();
    if(s.length()!=6)throw new Exception("Introduce los seis caracteres de la Passphrase.");
    return s;
  }
  private void pair(){
    final String h,p;
    try{h=host();p=pass();}catch(Exception e){say(e.getMessage());return;}
    say("Iniciando conexión con "+h+"... Comprueba que sea la IP actual de tu LG.");
    launch(()->{
      Session s=null;
      try {
        say("Descargando clave SSH del Key Server del LG...");
        byte[] key=keyFromTv(h);
        say("Verificando identidad y conectando por SSH...");
        s=connect(h,key,p);
        currentKey=key;
        prefs.edit().putString("last_ip",h).apply();
        say("¡LG conectado correctamente! Ahora selecciona tu archivo IPK.");
      }catch(Exception e){
        currentKey=null;
        String message=e.getMessage()==null?e.getClass().getSimpleName():e.getMessage();
        say("No se pudo conectar con "+h+": "+message+
          "\nVerifica la IP en Developer Mode, Key Server ON y la misma red Wi-Fi.");
      }
      finally{if(s!=null)s.disconnect();}
    });
  }
  private void forgetHost(){
    final String h=hostInput.getText().toString().trim();
    new AlertDialog.Builder(this).setTitle("Olvidar huella SSH")
      .setMessage("¿Olvidar la identidad guardada para "+h+"? Confirma solo si cambiaron tu televisor o la clave SSH.")
      .setPositiveButton("Olvidar",(d,w)->{
        prefs.edit().remove("pin_"+h).apply();currentKey=null;
        say("Huella olvidada. Vuelve a emparejar y verifica el LG.");
        working(false);
      }).setNegativeButton("Cancelar",null).show();
  }
  private void pickFile(){
    Intent picker=new Intent(Intent.ACTION_OPEN_DOCUMENT);
    picker.addCategory(Intent.CATEGORY_OPENABLE);
    picker.setType("*/*");
    startActivityForResult(picker,2001);
  }
  @Override protected void onActivityResult(int request,int result,Intent data){
    super.onActivityResult(request,result,data);
    if(request!=2001||result!=RESULT_OK||data==null||data.getData()==null)return;
    Uri uri=data.getData();String name="";long bytes=-1;
    try(Cursor c=getContentResolver().query(uri,null,null,null,null)){
      if(c!=null&&c.moveToFirst()){
        int i=c.getColumnIndex(OpenableColumns.DISPLAY_NAME);
        int j=c.getColumnIndex(OpenableColumns.SIZE);
        if(i>=0)name=c.getString(i);
        if(j>=0&&!c.isNull(j))bytes=c.getLong(j);
      }
    }catch(Exception ignored){}
    if(name==null||!name.toLowerCase(Locale.ROOT).endsWith(".ipk")||bytes>300L*1024*1024){
      say("Selecciona un archivo .ipk de menos de 300 MB.");return;
    }
    file=uri;selectedName=name;selectedBytes=bytes;
    fileName.setText(name+(bytes>=0?" · "+(bytes/(1024*1024))+" MB":""));
    installButton.setEnabled(currentKey!=null);
  }
  private String exec(Session s,String command,long maxMs,boolean requireInstall) throws Exception {
    ChannelExec c=(ChannelExec)s.openChannel("exec");
    c.setCommand(command);c.setInputStream(null);
    InputStream in=c.getInputStream();
    c.connect(13000);
    ByteArrayOutputStream output=new ByteArrayOutputStream();
    byte[] buf=new byte[8192];long start=System.currentTimeMillis();
    try{
      while(System.currentTimeMillis()-start<maxMs){
        int available=in.available();
        if(available>0){
          int n=in.read(buf,0,Math.min(buf.length,available));
          if(n>0)output.write(buf,0,n);
          if(output.size()>131072)throw new Exception("Respuesta demasiado extensa.");
        }
        String response=output.toString("UTF-8");
        String normalized=response.toLowerCase(Locale.ROOT).replaceAll("\\s+","");
        if(normalized.contains("\"returnvalue\":false")||normalized.contains("\"status\":\"failed\"")||
           normalized.contains("\"errorcode\":"))throw new Exception("webOS rechazó la operación: "+response.substring(0,Math.min(response.length(),400)));
        if(requireInstall && (normalized.contains("\"status\":\"installed\"")||
                              normalized.contains("\"status\":\"success\"")))return response;
        if(c.isClosed())break;
        Thread.sleep(180);
      }
      String response=output.toString("UTF-8");
      if(c.isClosed()&&c.getExitStatus()!=0)
        throw new Exception("Error de comando remoto ("+c.getExitStatus()+"): "+response.substring(0,Math.min(response.length(),300)));
      if(requireInstall&&!(response.toLowerCase(Locale.ROOT).contains("\"status\":\"installed\"")||
                           response.toLowerCase(Locale.ROOT).contains("\"status\": \"installed\"")))
        throw new Exception("No llegó confirmación de instalación; comprueba el estado en el LG. Respuesta: "+
          response.substring(0,Math.min(response.length(),300)));
      return response;
    }finally{c.disconnect();}
  }
  private void install(){
    if(file==null||currentKey==null){say("Conecta el LG y selecciona un archivo IPK.");return;}
    final String h,p;
    try{h=host();p=pass();}catch(Exception e){say(e.getMessage());return;}
    final Uri uri=file;final byte[] key=currentKey;
    launch(()->{
      Session s=null;ChannelSftp sftp=null;
      String remote="/media/developer/temp/cactus-"+System.currentTimeMillis()+".ipk";
      boolean confirmed=false;
      try{
        say("Conectando a LG vía SSH...");
        s=connect(h,key,p);
        exec(s,"/usr/bin/test -d /media/developer/temp || /bin/mkdir -p /media/developer/temp",12000,false);
        sftp=(ChannelSftp)s.openChannel("sftp");sftp.connect(13000);
        say("Enviando "+selectedName+" por SFTP...");
        try(InputStream in=getContentResolver().openInputStream(uri)){
          if(in==null)throw new Exception("No se pudo abrir el archivo IPK.");
          final long total=selectedBytes;
          sftp.put(in,remote,new SftpProgressMonitor(){
            long moved=0;int prior=-1;
            public void init(int op,String src,String dst,long max){}
            public boolean count(long n){
              moved+=n;int pct=total>0?(int)Math.min(100,moved*100/total):-1;
              if(pct>=0 && pct/10!=prior/10){prior=pct;say("Transferencia: "+pct+"%");}
              return true;
            }
            public void end(){}
          });
        }
        long received=sftp.stat(remote).getSize();
        if(selectedBytes>=0&&received!=selectedBytes)throw new Exception("El IPK transferido tiene tamaño distinto.");
        say("Archivo enviado. Solicitando instalación a LG webOS...");
        String params="{\"id\":\"com.ares.defaultName\",\"ipkUrl\":\""+remote+"\",\"subscribe\":true}";
        String cmd="/usr/bin/luna-send-pub -i luna://com.webos.appInstallService/dev/install '"+params+"'";
        String answer=exec(s,cmd,120000,true);
        confirmed=true;
        say("¡Instalación confirmada por webOS! Busca la aplicación en el menú de LG.");
      }catch(Exception e){say("Instalación no confirmada: "+e.getMessage());}
      finally{
        if(confirmed&&sftp!=null)try{sftp.rm(remote);}catch(Exception ignored){}
        if(sftp!=null)sftp.disconnect();
        if(s!=null)s.disconnect();
      }
    });
  }
  @Override public void onDestroy(){background.shutdownNow();currentKey=null;super.onDestroy();}
}
