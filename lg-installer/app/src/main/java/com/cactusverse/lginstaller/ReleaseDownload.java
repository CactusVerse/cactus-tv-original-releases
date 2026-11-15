package com.cactusverse.lginstaller;

import java.io.*;
import java.net.*;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Locale;

/** Downloads one pinned, published release; unverified partial files are never selected. */
final class ReleaseDownload {
  static final String VERSION="2.0.41";
  static final long LIMIT=300L*1024*1024;
  private static final String BASE="https://github.com/CactusVerse/cactus-tv-original-releases/releases/download/lg-2.0.41-caratulas/";
  static String name(boolean webos6){return "CactusTV_LG_"+(webos6?"webOS6":"Standard")+"_2.0.41_Caratulas.ipk";}
  static String hash(boolean webos6){return webos6?"cebbc95eab83be87972bde81171e20e319ca8f14e4b15d805be578db67775433":"bf7101c1721f08e5aa84c58ff44f5bd4a91a8b37db70c69c7dac0baa713b2c8f";}
  static boolean allowed(URL url){String host=url.getHost().toLowerCase(Locale.ROOT);return "https".equals(url.getProtocol())&&url.getUserInfo()==null&&(url.getPort()==-1||url.getPort()==443)&&(host.equals("github.com")||host.equals("release-assets.githubusercontent.com")||host.equals("objects.githubusercontent.com"));}
  static File download(File cache,boolean webos6)throws Exception{
    URL url=new URL(BASE+name(webos6));long deadline=System.currentTimeMillis()+180000;
    for(int redirects=0;redirects<=5;redirects++){
      if(!allowed(url))throw new IOException("Destino de descarga no permitido.");
      HttpURLConnection c=(HttpURLConnection)url.openConnection();
      c.setInstanceFollowRedirects(false);c.setConnectTimeout(15000);c.setReadTimeout(15000);c.setRequestProperty("User-Agent","CactusTV-LG-Installer/0.2.0");
      try{
        int status=c.getResponseCode();
        if(status>=300&&status<400){String location=c.getHeaderField("Location");if(location==null)throw new IOException("Redirección sin destino.");url=new URL(url,location);continue;}
        if(status!=200)throw new IOException("Servidor HTTP "+status);
        long length=c.getContentLengthLong();if(length>LIMIT)throw new IOException("Paquete demasiado grande.");
        File partial=File.createTempFile("cactus-download-",".part",cache);
        try{
          try(InputStream in=c.getInputStream();OutputStream out=new FileOutputStream(partial)){
            byte[] buffer=new byte[32768];long total=0;int n;
            while((n=in.read(buffer))!=-1){total+=n;if(total>LIMIT||System.currentTimeMillis()>deadline||Thread.currentThread().isInterrupted())throw new IOException("Descarga interrumpida o demasiado extensa.");out.write(buffer,0,n);}
            if(length>=0&&length!=total)throw new IOException("Descarga incompleta.");
          }
          verify(partial,hash(webos6));
          File target=new File(cache,name(webos6));if(target.exists()&&!target.delete())throw new IOException("No se puede reemplazar el paquete anterior.");
          if(!partial.renameTo(target))throw new IOException("No se pudo guardar el paquete verificado.");return target;
        }finally{if(partial.exists())partial.delete();}
      }finally{c.disconnect();}
    }
    throw new IOException("Demasiadas redirecciones.");
  }
  static void verify(File file,String expected)throws Exception{
    if(file.length()<8||file.length()>LIMIT)throw new IOException("Tamaño IPK inválido.");
    MessageDigest digest=MessageDigest.getInstance("SHA-256");
    try(InputStream in=new FileInputStream(file)){
      byte[] head=new byte[8];if(in.read(head)!=8||!"!<arch>\n".equals(new String(head,StandardCharsets.US_ASCII)))throw new IOException("El archivo no es un IPK.");
      digest.update(head);byte[] block=new byte[32768];int n;while((n=in.read(block))!=-1)digest.update(block,0,n);
    }
    StringBuilder actual=new StringBuilder();for(byte b:digest.digest())actual.append(String.format(Locale.ROOT,"%02x",b&255));
    if(!actual.toString().equals(expected))throw new IOException("SHA-256 distinto: no se instalará el archivo.");
  }
}
