package com.cactusverse.lginstaller;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.view.inputmethod.InputMethodManager;
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
  private String lastDiagnostic="Aún no se han ejecutado pruebas.";
  private Button testButton;
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
    add(root,label("INSTALLER LG webOS · BETA 0.1.3 · SELECTOR IPK",12,muted),8);
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
    testButton=button("1 · Probar la conexión de red");
    add(step2,testButton,4);
    testButton.setOnClickListener(v->{
      feedback("Botón de diagnóstico pulsado");
      testNetwork();
    });
    pairButton=button("2 · Conectar / emparejar LG");
    add(step2,pairButton,5);
    pairButton.setOnClickListener(v->{
      feedback("Botón de emparejamiento pulsado");
      pair();
    });
    status=label("Diagnóstico: toca Probar la conexión de red. No necesitas la passphrase para esta prueba.",15,ink);
    status.setMinHeight(dp(94));
    add(step2,status,8);
    Button copy=button("Copiar diagnóstico (sin claves)");
    add(step2,copy,4);
    copy.setOnClickListener(v->{
      ClipboardManager cb=(ClipboardManager)getSystemService(Context.CLIPBOARD_SERVICE);
      cb.setPrimaryClip(ClipData.newPlainText("Cactus LG diagnostico",lastDiagnostic));
      Toast.makeText(this,"Diagnóstico copiado",Toast.LENGTH_SHORT).show();
    });
    Button forget=button("Olvidar confianza SSH");add(step2,forget,0);
    forget.setOnClickListener(v->forgetHost());
    LinearLayout step3=card(root);
    add(step3,label("03  INSTALAR ARCHIVO IPK",16,accent),5);
    add(step3,label("Selecciona un .ipk autorizado guardado en el celular. No se descargan apps ni paquetes automáticamente.",13,muted),6);
    pickButton=button("Seleccionar archivo .ipk");add(step3,pickButton,5);
    pickButton.setOnClickListener(v->pickFile());
    Button alternatePicker=button("Otro explorador (si no funciona)");
    add(step3,alternatePicker,5);
    alternatePicker.setOnClickListener(v->pickFileAlternative());
    fileName=label("Ningún archivo seleccionado. Tras elegir el IPK, aquí aparecerá su nombre o un error.",14,ink);
    fileName.setMinHeight(dp(68));
    add(step3,fileName,7);
    installButton=button("Instalar en LG");installButton.setEnabled(false);
    add(step3,installButton,3);installButton.setOnClickListener(v->install());
    add(root,label("Proyecto experimental independiente. LG webOS Developer Mode puede caducar. La passphrase no se guarda.",11,muted),0);
    setContentView(scroll);
  }
  private void say(String s){main.post(()->{
    lastDiagnostic="Cactus TV Installer LG v0.1.2\n"+s;
    status.setText(s);
    boolean error=s.startsWith("No se")||s.startsWith("Error")||
                  s.contains("no responde")||s.contains("inválida")||
                  s.contains("cerrado")||s.contains("rechazada");
    status.setTextColor(error?Color.rgb(255,169,151):ink);
  });}
  private void feedback(String message){
    ((InputMethodManager)getSystemService(Context.INPUT_METHOD_SERVICE))
      .hideSoftInputFromWindow(hostInput.getWindowToken(),0);
    hostInput.clearFocus();passInput.clearFocus();
    say(message+"... comprobando.");
    Toast.makeText(this,message,Toast.LENGTH_SHORT).show();
  }
  private boolean tcpReachable(String host,int port,int timeout){
    try(Socket socket=new Socket()){
      socket.connect(new InetSocketAddress(host,port),timeout);
      return true;
    }catch(IOException e){return false;}
  }
  private void testNetwork(){
    final String ip;
    try {ip=host();}catch(Exception e){
      say("IP inválida: "+e.getMessage()+"\nRevisa la dirección que aparece AHORA en el LG.");
      return;
    }
    launch(()->{
      say("Probando "+ip+" en puertos LG 9991 y 9922...");
      boolean server=tcpReachable(ip,9991,2200);
      say("Key Server (9991): "+(server?"RESPONDE":"SIN RESPUESTA")+
          "\nComprobando SSH (9922)...");
      boolean ssh=tcpReachable(ip,9922,2200);
      String report="IP: "+ip+"\nKey Server 9991: "+(server?"ABIERTO":"NO ACCESIBLE")+
        "\nSSH webOS 9922: "+(ssh?"ABIERTO":"NO ACCESIBLE");
      if(server&&ssh){
        report+="\nLa conexión de red está lista. Ahora escribe la passphrase del LG y pulsa Emparejar.";
      } else {
        report+="\nVerifica la IP actual en Developer Mode, Key Server ON y que el celular y TV estén en la misma Wi-Fi. Si ambos fallan, comprueba si introdujiste la IP del celular en lugar de la del LG.";
      }
      say(report);
    });
  }
  private void working(boolean w){
    busy=w;
    main.post(()->{
      pairButton.setText(w?"Conectando con LG...":"2 · Conectar / emparejar LG");
      pairButton.setEnabled(!w);testButton.setEnabled(!w);pickButton.setEnabled(!w);
      hostInput.setEnabled(!w);passInput.setEnabled(!w);
      installButton.setEnabled(!w&&file!=null&&currentKey!=null);
    });
  }
  private void launch(Runnable task){
    if(busy)return;
    working(true);
    background.submit(()->{
      try {task.run();}
      catch(Throwable unexpected) {
        String msg=unexpected.getMessage();
        say("Error interno de la app: "+unexpected.getClass().getSimpleName()+
           (msg==null?"":" ("+msg+")")+". Copia el diagnóstico.");
      }
      finally {working(false);}
    });
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
    // webOS antiguos (p.ej. webOS 4.x) pueden anunciar solamente ssh-rsa
    // para la identidad del servidor y la autenticacion de llave publica.
    // Agregar RSA/SHA-1 AL FINAL, de modo que sigan prefiriendose algoritmos
    // modernos y su uso quede limitado a esta conexion local del LG.
    // Se mantiene la comprobacion estricta y huella SSH almacenada.
    session.setConfig("server_host_key",
        session.getConfig("server_host_key")+",ssh-rsa");
    session.setConfig("PubkeyAcceptedAlgorithms",
        session.getConfig("PubkeyAcceptedAlgorithms")+",ssh-rsa");
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
    try{h=host();p=pass();}catch(Exception e){
      say("No se puede iniciar el emparejamiento: "+e.getMessage());
      return;
    }
    say("Botón responde correctamente. Probando conexión a "+h+"...");
    launch(()->{
      Session s=null;
      try {
        say("Paso 1/3: verificando puertos del LG ("+h+")...");
        boolean server=tcpReachable(h,9991,3500);
        boolean sshPort=tcpReachable(h,9922,3500);
        if(!server||!sshPort)
          throw new IOException("Key Server 9991: "+(server?"OK":"SIN RESPUESTA")+
              "; SSH 9922: "+(sshPort?"OK":"SIN RESPUESTA")+
              ". Revisa IP actual, modo desarrollador y misma red.");
        say("Paso 2/3: descargando clave SSH de LG...");
        byte[] key=keyFromTv(h);
        say("Paso 3/3: autenticando SSH. Si aparece una huella, revisa y confirma.");
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
  // Selector compatible con proveedores DocumentsUI, Descargas, Drive y
  // administradores que no devuelven DISPLAY_NAME en el primer query.
  private void fileFeedback(String message,boolean error){
    main.post(()->{
      fileName.setText(message);
      fileName.setTextColor(error?Color.rgb(255,169,151):ink);
      if(error)Toast.makeText(MainActivity.this,message,Toast.LENGTH_LONG).show();
    });
  }

  private void pickFile(){
    if(busy)return;
    file=null;
    if(installButton!=null)installButton.setEnabled(false);
    fileFeedback("Abriendo el selector de archivos... Elige un paquete .ipk.",false);
    try {
      Intent picker=new Intent(Intent.ACTION_OPEN_DOCUMENT);
      picker.addCategory(Intent.CATEGORY_OPENABLE);
      picker.setType("*/*");
      picker.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION|Intent.FLAG_GRANT_PERSISTABLE_URI_PERMISSION);
      startActivityForResult(picker,2001);
    }catch(Exception e){
      fileFeedback("Error al abrir el selector: "+e.getMessage()+". Prueba Otro explorador.",true);
    }
  }
  private void pickFileAlternative(){
    if(busy)return;
    file=null;
    if(installButton!=null)installButton.setEnabled(false);
    fileFeedback("Abriendo otro explorador de archivos...",false);
    try{
      Intent other=new Intent(Intent.ACTION_GET_CONTENT);
      other.addCategory(Intent.CATEGORY_OPENABLE);
      other.setType("*/*");
      other.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
      startActivityForResult(Intent.createChooser(other,"Selecciona un archivo IPK"),2001);
    }catch(Exception e){fileFeedback("No se pudo abrir el explorador: "+e.getMessage(),true);}
  }

  @Override protected void onActivityResult(int request,int result,Intent data){
    super.onActivityResult(request,result,data);
    if(request!=2001)return;
    if(result!=RESULT_OK){
      fileFeedback(file==null?"Selección cancelada. Pulsa Seleccionar archivo .ipk para intentarlo de nuevo.":
        "Selección cancelada. Se mantiene el archivo anterior.",false);
      return;
    }
    Uri selectedUri=data==null?null:data.getData();
    if(selectedUri==null&&data!=null&&data.getClipData()!=null&&data.getClipData().getItemCount()>0){
      selectedUri=data.getClipData().getItemAt(0).getUri();
    }
    if(selectedUri==null){
      fileFeedback("El explorador no devolvió un archivo. Pulsa Otro explorador para probar una alternativa.",true);
      return;
    }
    final Uri selected=selectedUri;
    try {
      getContentResolver().takePersistableUriPermission(selected,Intent.FLAG_GRANT_READ_URI_PERMISSION);
    }catch(Exception notPersistable){
      // Algunos administradores ofrecen solo permisos temporales; aún sirven para esta sesión.
    }
    fileFeedback("Archivo recibido. Leyendo los datos del IPK...",false);
    launch(()->{
      try {
        String name=null;
        long bytes=-1L;
        try(Cursor cursor=getContentResolver().query(selected,
            new String[]{OpenableColumns.DISPLAY_NAME,OpenableColumns.SIZE},null,null,null)){
          if(cursor!=null&&cursor.moveToFirst()){
            int n=cursor.getColumnIndex(OpenableColumns.DISPLAY_NAME);
            int z=cursor.getColumnIndex(OpenableColumns.SIZE);
            if(n>=0&&!cursor.isNull(n))name=cursor.getString(n);
            if(z>=0&&!cursor.isNull(z))bytes=cursor.getLong(z);
          }
        }catch(Exception providerError){
          // Fallbacks for document providers that reject column projections.
        }
        if(name==null||name.trim().isEmpty()) {
          String last=selected.getLastPathSegment();
          if(last!=null){
            int slash=last.lastIndexOf('/');
            name=(slash>=0?last.substring(slash+1):last);
            if(name.startsWith("raw:"))name=name.substring(4);
          }
        }
        if(name==null)name="";
        name=name.trim();

        // Es posible que un administrador de archivos entregue la URI sin extensión,
        // pero un IPK webOS normal comienza con la cabecera de paquete ar.
        boolean arIpk=false;
        try(InputStream test=getContentResolver().openInputStream(selected)){
          if(test==null)throw new IOException("El proveedor no pudo abrir el archivo.");
          byte[] head=new byte[8];
          int pos=0;
          while(pos<8){
            int read=test.read(head,pos,8-pos);
            if(read<0)break;
            pos+=read;
          }
          arIpk=pos==8&&"!<arch>\n".equals(new String(head,StandardCharsets.US_ASCII));
        }
        if(bytes>300L*1024*1024)
          throw new IOException("Archivo demasiado grande (máximo 300 MB).");
        boolean ipkName=name.toLowerCase(Locale.ROOT).endsWith(".ipk");
        if(!ipkName&&!arIpk)
          throw new IOException("El archivo no parece un IPK. Nombre recibido: "+
            (name.isEmpty()?"desconocido":name)+". Usa el archivo .ipk original, sin descomprimir.");
        if(!arIpk)
          throw new IOException("El archivo no tiene cabecera IPK (ar). Puede estar dañado o no ser un IPK de webOS.");
        if(name.isEmpty()||!ipkName)name="paquete-lg.ipk";
        if(bytes==0)throw new IOException("El archivo seleccionado está vacío.");

        final String display=name;
        final long size=bytes;
        main.post(()->{
          file=selected;selectedName=display;selectedBytes=size;
          fileName.setText("✓ IPK listo: "+display+(size>=0?" ("+String.format(Locale.ROOT,"%.1f MB",(double)size/(1024*1024))+")":"")+
            "\nPulsa Instalar en LG para continuar.");
          fileName.setTextColor(Color.rgb(168,224,178));
          installButton.setEnabled(!busy&&currentKey!=null);
          Toast.makeText(MainActivity.this,"IPK seleccionado",Toast.LENGTH_SHORT).show();
        });
      }catch(Exception ex){
        String reason=ex.getMessage()==null?ex.getClass().getSimpleName():ex.getMessage();
        fileFeedback("No se pudo seleccionar el IPK: "+reason,true);
      }
    });
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
