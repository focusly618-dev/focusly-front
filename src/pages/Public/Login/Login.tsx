import React, { useEffect, useContext } from 'react';
import { Trans, useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
    <div className="min-h-screen w-full flex flex-col justify-between items-center relative overflow-hidden bg-gradient-to-br from-slate-50 via-slate-100 to-emerald-50/20 dark:from-[#0b0f14] dark:via-[#111215] dark:to-[#0f1715] p-4 transition-colors duration-300">
      {/* Ambient background glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 dark:bg-[#10b981]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-teal-500/10 dark:bg-[#008767]/15 rounded-full blur-3xl pointer-events-none" />

      {/* Theme Toggle Button Top Right */}
      <div className="absolute top-6 right-6 z-20">
        <Button
          isIconOnly
          variant="ghost"
          aria-label={t('login.toggleTheme')}
          onClick={colorMode.toggleColorMode}
          className="bg-white/80 dark:bg-[#18191e]/90 hover:dark:bg-[#22242c] backdrop-blur-md border border-slate-200 dark:border-[#25272e] shadow-sm rounded-full p-2 transition-colors"
        >
          {colorMode.mode !== 'light' ? (
            <LightModeIcon className="text-amber-400 text-lg" />
          ) : (
            <DarkModeIcon className="text-slate-700 text-lg" />
          )}
        </Button>
      </div>

      {/* Header Logo */}
      <div className="pt-8 pb-4 flex items-center justify-center z-10">
        <NavLink to="/" className="flex items-center gap-3 no-underline group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#008767] to-[#059669] flex items-center justify-center text-white font-black text-xl shadow-lg shadow-[#008767]/25 group-hover:scale-105 transition-transform duration-200">
            F
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-slate-900 dark:text-[#F3F4F6]">
            Focusly
          </span>
        </NavLink>
      </div>

      {/* Main HeroUI Card */}
      <div className="w-full max-w-md my-auto z-10 py-4">
        <Card className="w-full shadow-2xl border border-slate-200/80 dark:border-[#25272e] bg-white/95 dark:bg-[#18191e]/95 backdrop-blur-xl rounded-2xl overflow-hidden dark:shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]">
          {linkSent ? (
            <CardContent className="p-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-emerald-50 dark:bg-[#10b981]/15 text-emerald-600 dark:text-[#10b981] flex items-center justify-center mb-4 ring-8 ring-emerald-50/50 dark:ring-[#10b981]/10">
                <EmailIcon className="text-3xl" />
              </div>
              <CardTitle className="text-2xl font-bold text-slate-900 dark:text-[#F3F4F6] mb-2">
                {t('login.checkEmail.title')}
              </CardTitle>
              <CardDescription className="text-sm text-slate-500 dark:text-[#8A8F98] mb-6 leading-relaxed">
                {t('login.checkEmail.desc')} <br />
                <strong className="text-slate-800 dark:text-[#F3F4F6] font-semibold">
                  {email}
                </strong>
                .
                <br />
                {t('login.checkEmail.instructions')}
              </CardDescription>
              <Button
                variant="outline"
                onClick={() => setLinkSent(false)}
                className="font-medium flex items-center gap-2 border-slate-200 dark:border-[#25272e] bg-white dark:bg-[#14151a] hover:bg-slate-50 hover:dark:bg-[#1e2025] text-slate-700 dark:text-[#F3F4F6] transition-colors"
              >
                <ArrowBackIcon className="text-sm" />
                {t('login.checkEmail.back')}
              </Button>
            </CardContent>
          ) : (
            <>
              <CardHeader className="flex flex-col items-stretch px-8 pt-8 pb-2 gap-4">
                <div className="text-center">
                  <CardTitle className="text-2xl font-extrabold text-slate-900 dark:text-[#F3F4F6] tracking-tight mb-1">
                    {isRegistering
                      ? t('login.signUpTitle')
                      : t('login.signInTitle')}
                  </CardTitle>
                  <CardDescription className="text-xs sm:text-sm text-slate-500 dark:text-[#8A8F98]">
                    {t('login.subtitle')}
                  </CardDescription>
                </div>

                {/* HeroUI Tabs */}
                <Tabs
                  selectedKey={isRegistering ? 'signup' : 'signin'}
                  onSelectionChange={handleTabChange}
                  className="w-full"
                >
                  <TabList className="flex w-full bg-slate-100 dark:bg-[#121316] dark:border dark:border-[#25272e]/80 p-1 rounded-xl">
                    <Tab
                      id="signin"
                      className="flex-1 py-2 text-center text-sm font-semibold rounded-lg cursor-pointer transition-all data-[selected]:bg-white dark:data-[selected]:bg-[#22242c] dark:data-[selected]:border dark:data-[selected]:border-[#2e3037] data-[selected]:shadow-sm data-[selected]:text-[#008767] dark:data-[selected]:text-[#10B981] text-slate-600 dark:text-[#8A8F98] hover:dark:text-[#F3F4F6]"
                    >
                      {t('login.tabs.signIn')}
                    </Tab>
                    <Tab
                      id="signup"
                      className="flex-1 py-2 text-center text-sm font-semibold rounded-lg cursor-pointer transition-all data-[selected]:bg-white dark:data-[selected]:bg-[#22242c] dark:data-[selected]:border dark:data-[selected]:border-[#2e3037] data-[selected]:shadow-sm data-[selected]:text-[#008767] dark:data-[selected]:text-[#10B981] text-slate-600 dark:text-[#8A8F98] hover:dark:text-[#F3F4F6]"
                    >
                      {t('login.tabs.signUp')}
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
                  className="w-full border border-slate-200 dark:border-[#25272e] bg-white dark:bg-[#14151a] hover:bg-slate-50 hover:dark:bg-[#1e2025] hover:dark:border-[#2e3037] font-medium text-slate-700 dark:text-[#F3F4F6] py-3 rounded-xl flex items-center justify-center gap-3 transition-colors"
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
                  <span>{t('login.continueWithGoogle')}</span>
                </Button>

                <div className="flex items-center my-3 gap-3">
                  <Separator className="flex-1 bg-slate-200 dark:bg-[#25272e] h-px" />
                  <span className="text-xs text-slate-400 dark:text-[#8A8F98] uppercase tracking-wider font-semibold">
                    {t('login.orWithEmail')}
                  </span>
                  <Separator className="flex-1 bg-slate-200 dark:bg-[#25272e] h-px" />
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
                      <Label className="text-xs font-semibold text-slate-700 dark:text-[#F3F4F6]">
                        {t('login.fullName')}
                      </Label>
                      <div className="relative flex items-center">
                        <PersonIcon className="absolute left-3 text-slate-400 dark:text-[#8A8F98] text-lg pointer-events-none" />
                        <Input
                          placeholder={t('login.fullNamePlaceholder')}
                          disabled={isLoading}
                          value={fullName}
                          onChange={handleFullNameChange}
                          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#14151a] hover:dark:bg-[#17181f] focus:dark:bg-[#14151a] border border-slate-200 dark:border-[#25272e] rounded-xl text-slate-900 dark:text-[#F3F4F6] placeholder:text-slate-400 dark:placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#008767]/30 dark:focus:ring-[#10b981]/30 focus:border-[#008767] dark:focus:border-[#10b981] text-sm transition-all"
                        />
                      </div>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <Label className="text-xs font-semibold text-slate-700 dark:text-[#F3F4F6]">
                      {t('login.email')}
                    </Label>
                    <div className="relative flex items-center">
                      <EmailIcon className="absolute left-3 text-slate-400 dark:text-[#8A8F98] text-lg pointer-events-none" />
                      <Input
                        placeholder={t('login.emailPlaceholder')}
                        type="email"
                        disabled={isLoading}
                        value={email}
                        onChange={handleEmailChange}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-[#14151a] hover:dark:bg-[#17181f] focus:dark:bg-[#14151a] border border-slate-200 dark:border-[#25272e] rounded-xl text-slate-900 dark:text-[#F3F4F6] placeholder:text-slate-400 dark:placeholder:text-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#008767]/30 dark:focus:ring-[#10b981]/30 focus:border-[#008767] dark:focus:border-[#10b981] text-sm transition-all"
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    fullWidth
                    isDisabled={isLoading}
                    className="w-full bg-[#008767] hover:bg-[#007357] dark:bg-[#10b981] dark:hover:bg-[#059669] text-white font-semibold shadow-md shadow-[#008767]/20 dark:shadow-[#10b981]/25 transition-all py-3 rounded-xl mt-2 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isLoading ? (
                      <Spinner size="sm" color="current" />
                    ) : isRegistering ? (
                      t('login.createAccount')
                    ) : (
                      t('login.signIn')
                    )}
                  </Button>
                </form>

                {/* Signing in creates the account, so acceptance is stated up front */}
                <p className="text-xs leading-relaxed text-center text-slate-500 dark:text-[#8A8F98]">
                  <Trans
                    i18nKey="legal.loginNotice"
                    components={{
                      terms: (
                        <a
                          href="/terms"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#008767] dark:text-[#10B981] font-semibold hover:underline"
                        />
                      ),
                      privacy: (
                        <a
                          href="/privacy"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#008767] dark:text-[#10B981] font-semibold hover:underline"
                        />
                      ),
                    }}
                  />
                </p>
              </CardContent>

              <CardFooter className="px-8 pb-8 pt-2 flex flex-col items-center justify-center">
                <p className="text-xs text-slate-500 dark:text-[#8A8F98] text-center flex items-center justify-center gap-1.5">
                  <span>
                    {isRegistering
                      ? t('login.hasAccount')
                      : t('login.noAccount')}
                  </span>
                  <button
                    type="button"
                    onClick={toggleRegister}
                    className="text-[#008767] dark:text-[#10B981] font-semibold hover:underline bg-transparent border-0 cursor-pointer p-0"
                  >
                    {isRegistering
                      ? t('login.signInHere')
                      : t('login.signUpHere')}
                  </button>
                </p>
              </CardFooter>
            </>
          )}
        </Card>
      </div>

      {/* Footer Links */}
      <div className="pb-6 z-10 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-500 dark:text-[#8A8F98]">
        <Link
          href="/terms"
          className="text-xs text-slate-500 dark:text-[#8A8F98] hover:text-slate-800 hover:dark:text-[#F3F4F6] transition-colors"
        >
          {t('login.termsOfService')}
        </Link>
        <Link
          href="/privacy"
          className="text-xs text-slate-500 dark:text-[#8A8F98] hover:text-slate-800 hover:dark:text-[#F3F4F6] transition-colors"
        >
          {t('login.privacyPolicy')}
        </Link>
        <Link
          href="#"
          className="text-xs text-slate-500 dark:text-[#8A8F98] hover:text-slate-800 hover:dark:text-[#F3F4F6] transition-colors"
        >
          {t('login.helpCenter')}
        </Link>
        <span className="text-slate-400 dark:text-[#6B7280]">
          {t('login.copyright')}
        </span>
      </div>
    </div>
  );
};

export default Login;
