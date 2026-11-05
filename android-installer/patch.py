#!/usr/bin/env python3
"""Fork experimental Cactus TV Installer para Apps2Samsung v3.1.0. Solo WGT local."""
from pathlib import Path
import sys
import shutil
base=Path(__file__).resolve().parent
root=Path(sys.argv[1]).resolve()
if not (root/"Apps2Samsung.Mobile/Apps2Samsung.Mobile.csproj").exists():
    raise SystemExit("Debe indicarse la carpeta del código Apps2Samsung v3.1.0")

def patch(path,old,new):
    f=root/path
    txt=f.read_text(encoding="utf-8-sig")
    if old not in txt: raise RuntimeError("Cambio incompatible con la version upstream: "+path+" "+old[:80])
    f.write_text(txt.replace(old,new,1),encoding="utf-8")

p="Apps2Samsung.Mobile/Apps2Samsung.Mobile.csproj"
patch(p,"<ApplicationTitle>Apps2Samsung</ApplicationTitle>","<ApplicationTitle>Cactus TV Installer</ApplicationTitle>")
patch(p,"<ApplicationId>nl.madebypatrick.apps2samsung</ApplicationId>","<ApplicationId>com.cactusverse.cactustvinstaller</ApplicationId>")
patch(p,"<ApplicationDisplayVersion>3.1.0</ApplicationDisplayVersion>","<ApplicationDisplayVersion>0.1.0</ApplicationDisplayVersion>")
patch(p,"<ApplicationVersion>5</ApplicationVersion>","<ApplicationVersion>1</ApplicationVersion>")
patch(p,'<MauiIcon Include="Resources\\AppIcon\\appicon.png" Color="#F2F2F7" ForegroundScale="0.68" />','<MauiIcon Include="Resources\\AppIcon\\appicon.svg" Color="#211B17" />')
patch(p,'<MauiSplashScreen Include="Resources\\Splash\\a2s_splash.png" Color="#F2F2F7" BaseSize="120,120" />','<MauiSplashScreen Include="Resources\\Splash\\cactus_splash.svg" Color="#211B17" BaseSize="180,180" />')
design="Apps2Samsung.Core/Design/DesignTokens.cs"
for old,new in [
('Accent = new("#10B981", "#2DD4BF")','Accent = new("#AC7047", "#D6A16A")'),
('AccentHover = new("#059669", "#5EEAD4")','AccentHover = new("#925839", "#EDB882")'),
('AccentSoft = new("#1F10B981", "#2E2DD4BF")','AccentSoft = new("#1FAC7047", "#2ED6A16A")'),
('OnAccent = new("#FFFFFF", "#042F2E")','OnAccent = new("#FFFFFF", "#211B17")'),
('OnAccentMuted = new("#BFFFFFFF", "#BF042F2E")','OnAccentMuted = new("#BFFFFFFF", "#BF211B17")'),
('Bg = new("#F2F2F7", "#000000")','Bg = new("#F5EDE5", "#151310")'),
('Surface = new("#FFFFFF", "#1C1C1E")','Surface = new("#FFF9F1", "#24201D")'),
('Surface2 = new("#F7F7FA", "#2C2C2E")','Surface2 = new("#F3E8DB", "#302923")'),
('Ink = new("#1C1C1E", "#F2F2F7")','Ink = new("#241C16", "#F6E8D8")'),
('Muted = new("#6C6C70", "#98989F")','Muted = new("#705E50", "#B0A093")'),
('Glass = new("#0D1B2A", "#0D1B2A")','Glass = new("#211913", "#211913")'),
('LedBusy = new("#2DD4BF", "#2DD4BF")','LedBusy = new("#D6A16A", "#D6A16A")'),
]: patch(design,old,new)
patch("Apps2Samsung.Mobile/Controls/TopBarView.xaml",'Source="a2s_logo.png"','Source="cactus_logo.png"')
x="Apps2Samsung.Mobile/Pages/InstallerPage.xaml"
patch(x,'Title="Apps2Samsung"','Title="Cactus TV Installer"')
hero='''                <Border Padding="18" StrokeThickness="0" StrokeShape="RoundRectangle 18" BackgroundColor="#29231E">
                    <VerticalStackLayout Spacing="10">
                        <Label Text="CACTUS TV" FontAttributes="Bold" FontSize="24" TextColor="#E8BE91"/>
                        <Label Text="INSTALLER PARA SAMSUNG" FontAttributes="Bold" FontSize="12" TextColor="#D3B596"/>
                        <Label Text="Instala Cactus TV desde tu celular. Conecta tu Samsung y selecciona el paquete .wgt que ya tienes guardado." FontSize="14" TextColor="#F8E9DB"/>
                        <Button Text="INSTALAR CACTUS TV (.WGT)" Clicked="OnCactusWgtClicked" FontAttributes="Bold" BackgroundColor="#D6A16A" TextColor="#211B17" CornerRadius="12" MinimumHeightRequest="54"/>
                        <Label Text="Modo de prueba: no descarga ni distribuye paquetes automáticamente." FontSize="11" TextColor="#C6AB94" />
                    </VerticalStackLayout>
                </Border>
'''
patch(x,'                <controls:TvCardView x:Name="TvCard" />','                <controls:TvCardView x:Name="TvCard" />\n\n'+hero)
patch(x,'<!-- Catalog -->\n                <VerticalStackLayout Spacing="10">','<!-- Catalog oculto en la variante Cactus -->\n                <VerticalStackLayout Spacing="10" IsVisible="False">')
cs="Apps2Samsung.Mobile/Pages/InstallerPage.xaml.cs"
handler='''\t// Acción personalizada: mantiene el flujo original de firma y envío.
\tprivate async void OnCactusWgtClicked(object? sender, EventArgs e)
\t{
\t\tif (_busy) return;
\t\tvar path = await PickCustomWgtAsync();
\t\tif (path is not null) await InstallAsync(null, null, path);
\t}

'''
patch(cs,'\t// "Your own package": a .wgt or .tpk from the phone, then the same install as a catalog app.',handler+'\t// "Your own package": a .wgt or .tpk from the phone, then the same install as a catalog app.')
patch(cs,'\t\t_ = CheckForUpdatesAsync();','\t\t// Sin autoactualizaciones del software original.')
patch("Apps2Samsung.Mobile/Pages/SettingsPage.xaml.cs",'await updates.RunAsync(this, manual: true);','await DisplayAlert("Cactus TV Installer", "Las actualizaciones de este instalador se distribuirán por separado.", "Aceptar");')
for src,dst in {
"assets/cactus_appicon.svg":"Apps2Samsung.Mobile/Resources/AppIcon/appicon.svg",
"assets/cactus_splash.svg":"Apps2Samsung.Mobile/Resources/Splash/cactus_splash.svg",
"assets/cactus_logo.svg":"Apps2Samsung.Mobile/Resources/Images/cactus_logo.svg"
}.items():
    target=root/dst
    target.parent.mkdir(parents=True,exist_ok=True)
    shutil.copy2(base/src,target)
(root/"CACTUS-TV-NOTICE.txt").write_text("Cactus TV Installer v0.1 prueba. Basado en Apps2Samsung v3.1.0 (c) 2025 Patrick Stel, licencia MIT. LICENSE y NOTICE.md originales permanecen sin cambios. No distribuye archivos WGT.\n",encoding="utf-8")
print("Adaptacion Cactus OK")
