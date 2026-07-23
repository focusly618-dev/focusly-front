import React, { useEffect, useContext } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Input,
  Label,
  Separator,
  Link,
  Tabs,
  TabList,
  Tab,
  Spinner,
} from '@heroui/react';
import {
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Email as EmailIcon,
  Person as PersonIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import { NavLink } from 'react-router-dom';
import { ColorModeContext } from '@/context';
import { useLogin } from './Login.hook';

export const Login: React.FC = () => {
  const colorMode = useContext(ColorModeContext);
  const {
    loginGoogle,
    isLoading,
    email,
    fullName,
    isRegistering,
    handleEmailChange,
    handleFullNameChange,
    onSignIn,
    linkSent,
    setLinkSent,
    completeMagicLinkSignIn,
    toggleRegister,
  } = useLogin();

  useEffect(() => {
    // Check if returning from email magic link
    void completeMagicLinkSignIn();
  }, [completeMagicLinkSignIn]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onSignIn();
    }
  };

  const handleTabChange = (key: React.Key) => {
    const isSignupTab = key === 'signup';
    if ((isSignupTab && !isRegistering) || (!isSignupTab && isRegistering)) {
      toggleRegister();
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-between items-center relative overflow-hidden bg-gradient-to-br from-slate-50 via-slate-100 to-indigo-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/40 p-4 transition-colors duration-300">
      {/* Ambient background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Theme Toggle Button Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <Button
          isIconOnly
          variant="quiet"
          aria-label="Toggle theme"
          onClick={colorMode.toggleColorMode}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-md border border-slate-200 dark:border-slate-700/60 shadow-sm rounded-full p-2"
        >
          {colorMode.mode === 'dark' ? (
            <LightModeIcon className="text-amber-400 text-lg" />
          ) : (
            <DarkModeIcon className="text-slate-700 text-lg" />
          )}
        </Button>
      </div>

      {/* Header Logo */}
      <div className="pt-8 pb-4 flex items-center justify-center z-10">
        <NavLink to="/" className="flex items-center gap-3 no-underline group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
            F
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-white">
            Focusly
          </span>
        </NavLink>
      </div>

      {/* Main HeroUI Card */}
      <div className="w-full max-w-md my-auto z-10 py-4">
        <Card className="w-full shadow-2xl border border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-2xl overflow-hidden">
          {linkSent ? (
            <CardContent className="p-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-4 ring-8 ring-indigo-50/50 dark:ring-indigo-950/30">
                <EmailIcon className="text-3xl" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                Revisa tu correo
              </CardTitle>
              <CardDescription className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
                Hemos enviado un enlace de acceso a <br />
                <strong className="text-slate-800 dark:text-slate-200 font-semibold">{email}</strong>.
                <br />
                Haz clic en el enlace para ingresar al instante.
              </CardDescription>
              <Button
                variant="outline"
                onClick={() => setLinkSent(false)}
                className="font-medium flex items-center gap-2"
              >
                <ArrowBackIcon className="text-sm" />
                Volver a iniciar sesión
              </Button>
            </CardContent>
          ) : (
            <>
              <CardHeader className="flex flex-col items-stretch px-8 pt-8 pb-2 gap-4">
                <div className="text-center">
                  <CardTitle className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-1">
                    {isRegistering ? 'Crear una cuenta' : 'Bienvenido de nuevo'}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                    Ingresa tus datos para acceder a tu espacio de trabajo.
                  </CardDescription>
                </div>

                {/* HeroUI Tabs */}
                <Tabs
                  selectedKey={isRegistering ? 'signup' : 'signin'}
                  onSelectionChange={handleTabChange}
                  className="w-full"
                >
                  <TabList className="flex w-full bg-slate-100 dark:bg-slate-800/60 p-1 rounded-xl">
                    <Tab
                      id="signin"
                      className="flex-1 py-2 text-center text-sm font-semibold rounded-lg cursor-pointer transition-all data-[selected]:bg-white dark:data-[selected]:bg-slate-700 data-[selected]:shadow-sm data-[selected]:text-indigo-600 dark:data-[selected]:text-indigo-400 text-slate-600 dark:text-slate-400"
                    >
                      Iniciar Sesión
                    </Tab>
                    <Tab
                      id="signup"
                      className="flex-1 py-2 text-center text-sm font-semibold rounded-lg cursor-pointer transition-all data-[selected]:bg-white dark:data-[selected]:bg-slate-700 data-[selected]:shadow-sm data-[selected]:text-indigo-600 dark:data-[selected]:text-indigo-400 text-slate-600 dark:text-slate-400"
                    >
                      Registrarse
                    </Tab>
                  </TabList>
                </Tabs>
              </CardHeader>

              <CardContent className="px-8 py-4 space-y-4">
                {/* HeroUI Google Button */}
                <Button
                  variant="outline"
                  fullWidth
                  isDisabled={isLoading}
                  onClick={() => loginGoogle()}
                  className="w-full border border-slate-200 dark:border-slate-700/80 hover:bg-slate-50 dark:hover:bg-slate-800 font-medium text-slate-700 dark:text-slate-200 py-3 rounded-xl flex items-center justify-center gap-3"
                >
                  <svg width="20" height="20" viewBox="0 0 18 18">
                    <path
                      d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z"
                      fill="#4285F4"
                    />
                    <path
                      d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.683 5.482 18 9 18z"
                      fill="#34A853"
                    />
                    <path
                      d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M9 3.579c1.32 0 2.508.454 3.44 1.345l2.582-2.58C13.463.894 11.426 0 9 0 5.482 0 2.438 2.317.957 5.27l3.007 2.332C4.672 5.163 6.656 3.579 9 3.579z"
                      fill="#EA4335"
                    />
                  </svg>
                  <span>Continuar con Google</span>
                </Button>

                <div className="flex items-center my-3 gap-3">
                  <Separator className="flex-1 bg-slate-200 dark:bg-slate-700/80 h-px" />
                  <span className="text-xs text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">
                    o con correo
                  </span>
                  <Separator className="flex-1 bg-slate-200 dark:bg-slate-700/80 h-px" />
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    onSignIn();
                  }}
                  onKeyDown={handleKeyDown}
                  className="space-y-4"
                >
                  {isRegistering && (
                    <div className="space-y-1.5">
                      <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Nombre Completo
                      </Label>
                      <div className="relative flex items-center">
                        <PersonIcon className="absolute left-3 text-slate-400 text-lg pointer-events-none" />
                        <Input
                          placeholder="Ej. Juan Pérez"
                          isDisabled={isLoading}
                          value={fullName}
                          onChange={handleFullNameChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Correo Electrónico
                    </Label>
                    <div className="relative flex items-center">
                      <EmailIcon className="absolute left-3 text-slate-400 text-lg pointer-events-none" />
                      <Input
                        placeholder="nombre@empresa.com"
                        type="email"
                        isDisabled={isLoading}
                        value={email}
                        onChange={handleEmailChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    fullWidth
                    isDisabled={isLoading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold shadow-lg shadow-indigo-500/25 transition-all py-3 rounded-xl mt-2 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <Spinner size="sm" color="current" />
                    ) : isRegistering ? (
                      'Crear Cuenta'
                    ) : (
                      'Ingresar'
                    )}
                  </Button>
                </form>
              </CardContent>

              <CardFooter className="px-8 pb-8 pt-2 flex flex-col items-center justify-center">
                <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
                  {isRegistering ? '¿Ya tienes una cuenta? ' : '¿No tienes una cuenta? '}
                  <button
                    type="button"
                    onClick={toggleRegister}
                    className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline bg-transparent border-0 cursor-pointer p-0"
                  >
                    {isRegistering ? 'Inicia sesión aquí' : 'Regístrate gratis'}
                  </button>
                </p>
              </CardFooter>
            </>
          )}
        </Card>
      </div>

      {/* Footer Links */}
      <div className="pb-6 z-10 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-400 dark:text-slate-500">
        <Link href="#" className="text-xs text-slate-500 hover:underline">
          Términos de Servicio
        </Link>
        <Link href="#" className="text-xs text-slate-500 hover:underline">
          Política de Privacidad
        </Link>
        <Link href="#" className="text-xs text-slate-500 hover:underline">
          Centro de Ayuda
        </Link>
        <span>© 2026 Focusly</span>
      </div>
    </div>
  );
};

export default Login;
