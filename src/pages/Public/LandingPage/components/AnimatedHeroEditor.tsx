import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import GridViewIcon from '@mui/icons-material/GridView';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MicIcon from '@mui/icons-material/Mic';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import ImageIcon from '@mui/icons-material/Image';
import AspectRatioIcon from '@mui/icons-material/AspectRatio';
import StarIcon from '@mui/icons-material/Star';
import FolderIcon from '@mui/icons-material/Folder';
import { CuteRobotIcon } from '@/components/ui';

export default function AnimatedHeroEditor() {
  const [step, setStep] = useState(0);
  const [typedText, setTypedText] = useState('');

  // Custom spring configurations for premium feeling
  const springTransition = {
    type: 'spring',
    stiffness: 100,
    damping: 18,
  } as const;
  const fastSpring = { type: 'spring', stiffness: 140, damping: 15 } as const;

  const tasks = [
    { id: 1, text: 'Gym at 7 AM', time: '07:00' },
    { id: 2, text: 'Finish GraphQL API', time: '10:30' },
    { id: 3, text: 'English Practice', time: '16:00' },
  ];

  const calendarEvents = [
    {
      title: 'Workout',
      time: '07:00 - 08:00',
      color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    },
    {
      title: 'Deep Work',
      time: '10:00 - 13:00',
      color: 'bg-violet-500/20 text-violet-300 border-violet-500/30',
    },
    {
      title: 'Lunch',
      time: '13:00 - 14:00',
      color: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    },
    {
      title: 'Study',
      time: '15:30 - 17:00',
      color: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
    },
  ];

  // Control the sequence of steps
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (step === 0) {
      setTypedText('');
      timer = setTimeout(() => setStep(1), 500);
    } else if (step === 1) {
      // Typing "Plan my week"
      const targetText = 'Plan my week';
      let currentLength = 0;

      const typingInterval = setInterval(
        () => {
          if (currentLength < targetText.length) {
            currentLength++;
            setTypedText(targetText.substring(0, currentLength));
          } else {
            clearInterval(typingInterval);
            // Wait after typing finished
            timer = setTimeout(() => {
              setStep(2);
            }, 1200);
          }
        },
        90 + Math.random() * 50,
      ); // Human-like typing speed variation

      return () => {
        clearInterval(typingInterval);
        clearTimeout(timer);
      };
    } else if (step === 2) {
      // Loading state (Lumina AI is writing...)
      timer = setTimeout(() => {
        setStep(3);
      }, 2500);
    } else if (step === 3) {
      // Tasks fade-in
      timer = setTimeout(() => {
        setStep(4);
      }, 2800);
    } else if (step === 4) {
      // AI schedule calendar slide-in
      timer = setTimeout(() => {
        setStep(5);
      }, 4000);
    } else if (step === 5) {
      // Transform to Dashboard
      timer = setTimeout(() => {
        setStep(0); // Restart loop
      }, 5000);
    }

    return () => clearTimeout(timer);
  }, [step]);

  return (
    <div className="relative w-full max-w-full sm:max-w-[700px] md:max-w-[900px] mx-auto select-none font-sans px-4 sm:px-0">
      {/* Background Radial Glow */}
      <div className="absolute -inset-10 bg-gradient-to-tr from-[#7C3AED]/20 via-[#A855F7]/10 to-transparent blur-3xl rounded-full opacity-60 pointer-events-none" />

      {/* Editor Frame */}
      <div className="relative w-full h-[540px] bg-[#111827]/85 backdrop-blur-xl border border-[rgba(255,255,255,0.06)] rounded-[24px] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.75)] overflow-hidden flex flex-row transition-all duration-500 ease-in-out">
        {/* LEFT SIDEBAR (Styled exactly like Focusly's sidebar navigation) */}
        <div className="hidden sm:flex flex-col w-48 border-r border-[rgba(255,255,255,0.06)] bg-[#0B0F14]/40 p-4 shrink-0 justify-between">
          <div className="flex flex-col gap-6">
            {/* Mac OS Window Buttons */}
            <div className="flex flex-row gap-1.5 pt-1">
              <span className="w-3 h-3 rounded-full bg-[#FF5F56] opacity-80" />
              <span className="w-3 h-3 rounded-full bg-[#FFBD2E] opacity-80" />
              <span className="w-3 h-3 rounded-full bg-[#27C93F] opacity-80" />
            </div>

            {/* App Branding */}
            <div className="flex items-center gap-2.5 px-1">
              <div className="w-5.5 h-5.5 rounded-md bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shadow-md shadow-violet-500/20">
                <AutoAwesomeIcon
                  className="text-white"
                  style={{ fontSize: 11 }}
                />
              </div>
              <span className="font-bold text-xs text-[#FAFAFA] tracking-wide">
                Focusly
              </span>
            </div>

            {/* Sidebar Menus & Navigation */}
            <nav className="flex flex-col gap-1">
              <div
                className={`flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-lg border transition-all cursor-pointer ${
                  step === 5
                    ? 'bg-[rgba(255,255,255,0.04)] text-[#FAFAFA] border-[rgba(255,255,255,0.04)]'
                    : 'text-[#A1A1AA] border-transparent hover:text-[#FAFAFA]'
                }`}
              >
                <GridViewIcon
                  style={{ fontSize: 13 }}
                  className={step === 5 ? 'text-violet-400' : ''}
                />
                <span>Daily Plan</span>
              </div>
              <div
                className={`flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-lg border transition-all cursor-pointer ${
                  step === 4
                    ? 'bg-[rgba(255,255,255,0.04)] text-[#FAFAFA] border-[rgba(255,255,255,0.04)]'
                    : 'text-[#A1A1AA] border-transparent hover:text-[#FAFAFA]'
                }`}
              >
                <CalendarMonthIcon
                  style={{ fontSize: 13 }}
                  className={step === 4 ? 'text-violet-400' : ''}
                />
                <span>Calendar</span>
              </div>
              <div className="flex items-center justify-between px-2.5 py-1.5 text-xs text-[#A1A1AA] hover:text-[#FAFAFA] transition-colors cursor-pointer">
                <div className="flex items-center gap-2">
                  <FormatListBulletedIcon style={{ fontSize: 13 }} />
                  <span>Tasks</span>
                </div>
              </div>
              <div
                className={`flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-lg border transition-all cursor-pointer ${
                  step <= 3
                    ? 'bg-[rgba(255,255,255,0.04)] text-[#FAFAFA] border-[rgba(255,255,255,0.04)]'
                    : 'text-[#A1A1AA] border-transparent hover:text-[#FAFAFA]'
                }`}
              >
                <InsertDriveFileIcon
                  style={{ fontSize: 13 }}
                  className={step <= 3 ? 'text-violet-400' : ''}
                />
                <span>Workspaces</span>
              </div>
            </nav>
          </div>

          <div className="flex flex-col gap-4">
            {/* Quick Profile */}
            <div className="flex items-center gap-2 px-2 py-1.5 border border-[rgba(255,255,255,0.04)] bg-[#111827]/40 rounded-lg text-xs">
              <div className="w-5 h-5 rounded-full bg-[#7C3AED] text-[10px] text-white flex items-center justify-center font-bold">
                A
              </div>
              <span className="text-[#A1A1AA] font-medium truncate">
                Alexis
              </span>
            </div>
          </div>
        </div>

        {/* MAIN CONTAINER */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#0B0F14]/40 relative overflow-hidden">
          {/* EDITOR HEADER (Styled exactly like Focusly's StyledEditorHeader) */}
          <header className="h-12 border-b border-[rgba(255,255,255,0.06)] px-4 flex items-center justify-between bg-[#111827]/30 z-10 shrink-0">
            {/* Back Button */}
            <div>
              <button className="h-[28px] px-3 rounded-full border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] backdrop-blur-md text-[#A1A1AA] text-[10px] font-bold flex items-center gap-1.5 hover:border-[#FAFAFA] hover:text-[#FAFAFA] transition-all cursor-pointer">
                <ArrowBackIcon style={{ fontSize: 10 }} />
                <span>Back</span>
              </button>
            </div>

            {/* Right side header actions */}
            <div className="flex items-center gap-2.5">
              {/* dictation icon */}
              <button className="w-7 h-7 rounded-full border border-[rgba(255,255,255,0.08)] text-[#A1A1AA] flex items-center justify-center hover:bg-[rgba(255,255,255,0.04)] transition-all cursor-pointer">
                <MicIcon style={{ fontSize: 12 }} />
              </button>

              {/* Save Status Indicator */}
              <div className="flex items-center gap-1.5 px-3 py-1 border border-emerald-500/20 bg-[#10B981]/5 rounded-full h-7">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] shadow-[0_0_8px_#10B981]" />
                <span className="text-[#10B981] text-[10px] font-bold tracking-wide">
                  saved
                </span>
              </div>
            </div>
          </header>

          {/* WORKSPACE CONTENT AREA */}
          <div className="flex-1 flex flex-col relative overflow-y-auto overflow-x-hidden min-h-0">
            <AnimatePresence mode="wait">
              {step <= 4 ? (
                <motion.div
                  key="editor-workspace"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={springTransition}
                  className="flex-grow flex flex-col min-w-0"
                >
                  {/* GRADIENT COVER BANNER (Matches Focusly's Cover) */}
                  <div className="w-full h-24 bg-gradient-to-r from-violet-900/40 via-purple-900/40 to-pink-900/40 relative shrink-0">
                    {/* Shadow overlay */}
                    <div className="absolute inset-0 bg-black/10" />
                  </div>

                  {/* Icon Card & Cover Actions Toolbar Row */}
                  <div className="px-6 sm:px-8 relative z-10 shrink-0">
                    {/* Floating icon card sitting on top of the cover edge */}
                    <div className="absolute -top-7 left-6 sm:left-8 w-14 h-14 rounded-2xl bg-[#111827] border border-[rgba(255,255,255,0.08)] shadow-[0_4px_20px_rgba(0,0,0,0.4)] flex items-center justify-center">
                      <StarIcon
                        className="text-violet-400"
                        style={{ fontSize: 24 }}
                      />
                    </div>

                    {/* Small Actions list matching ghostBtnSx row in Focusly */}
                    <div className="flex justify-end items-center gap-2 pt-2.5 pb-2 text-[10px] text-[#A1A1AA] font-semibold">
                      <div className="flex items-center gap-1 hover:text-[#FAFAFA] transition-all cursor-pointer">
                        <InsertEmoticonIcon style={{ fontSize: 12 }} />
                        <span>Change icon</span>
                      </div>
                      <span className="opacity-30">•</span>
                      <div className="flex items-center gap-1 hover:text-[#FAFAFA] transition-all cursor-pointer">
                        <ImageIcon style={{ fontSize: 12 }} />
                        <span>Change cover</span>
                      </div>
                      <span className="opacity-30">•</span>
                      <div className="flex items-center gap-1 hover:text-[#FAFAFA] transition-all cursor-pointer">
                        <AspectRatioIcon style={{ fontSize: 12 }} />
                        <span>Focus view</span>
                      </div>
                    </div>
                  </div>

                  {/* Text Editor Body Area (Looks like BlockNote view) */}
                  <div className="flex-grow px-6 sm:px-8 pt-4 pb-6 flex flex-col min-w-0">
                    {/* FOLDER BADGE */}
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-violet-500/10 text-violet-400 rounded border border-violet-500/20 mb-3 w-max select-none">
                      <FolderIcon style={{ fontSize: 10 }} />
                      <span className="text-[9px] font-bold tracking-wider uppercase">
                        PROJECTS
                      </span>
                    </div>

                    {/* borderless Title Input */}
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-[#FAFAFA] tracking-tight mb-5 border-b border-transparent focus:outline-none">
                      Weekly Sprint Planner
                    </h1>

                    {/* BlockNote content container */}
                    <div className="flex-grow relative flex flex-col min-h-[220px]">
                      {/* AI Command Input Bar inside Document Body */}
                      <div className="w-full max-w-lg mx-auto bg-[#18181B]/95 border border-[rgba(255,255,255,0.08)] rounded-xl p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.6)] mb-5 flex flex-col relative z-20">
                        <div className="flex items-center gap-3">
                          <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center shrink-0 shadow-md shadow-violet-500/25">
                            <CuteRobotIcon
                              size={14}
                              variant="mini"
                              primaryColor="#FFF"
                              eyeColor="#FFF"
                            />
                          </div>
                          <div className="flex-1 flex items-center text-[#FAFAFA] font-mono text-xs leading-none py-1 relative">
                            <span>{typedText}</span>
                            {/* Caret */}
                            {step === 1 && (
                              <motion.span
                                animate={{ opacity: [1, 0, 1] }}
                                transition={{
                                  repeat: Infinity,
                                  duration: 0.8,
                                  ease: 'linear',
                                }}
                                className="inline-block w-1.5 h-3.5 ml-1 bg-violet-400"
                              />
                            )}
                            {step === 0 && (
                              <span className="text-[#A1A1AA]/40 text-xs font-sans absolute left-0 font-light pointer-events-none">
                                Ask Lumina AI to plan your goals...
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Tasks Checklist generated inside Document Body */}
                      <div className="w-full max-w-lg mx-auto flex flex-col gap-2 relative">
                        <AnimatePresence>
                          {step >= 3 &&
                            tasks.map((task, i) => (
                              <motion.div
                                key={task.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ ...fastSpring, delay: i * 0.15 }}
                                className="w-full flex items-center justify-between p-3 bg-[#111827]/40 hover:bg-[#111827]/60 border border-[rgba(255,255,255,0.05)] rounded-xl transition-all duration-300"
                              >
                                <div className="flex items-center gap-3">
                                  <motion.div
                                    initial={{ scale: 0.8 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: i * 0.2 + 0.3 }}
                                    className="flex items-center justify-center text-violet-400"
                                  >
                                    <CheckCircleIcon style={{ fontSize: 16 }} />
                                  </motion.div>
                                  <span className="text-[#FAFAFA] text-xs font-medium">
                                    {task.text}
                                  </span>
                                </div>
                                <span className="text-[9px] font-mono text-[#A1A1AA] bg-[#111827]/80 px-2 py-0.5 rounded border border-[rgba(255,255,255,0.04)]">
                                  {task.time}
                                </span>
                              </motion.div>
                            ))}
                        </AnimatePresence>
                      </div>

                      {/* Lumina AI Writing Overlay (Matches exactly how Lumina AI is writing... is shown in Focusly) */}
                      <AnimatePresence>
                        {step === 2 && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-[#0B0F14]/50 backdrop-blur-[2px] flex items-center justify-center z-30 rounded-xl"
                          >
                            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#1e1b4b] border border-violet-500/20 shadow-[0_8px_32px_rgba(15,23,76,0.3),0_0_16px_rgba(124,58,237,0.15)] animate-pulse">
                              <CuteRobotIcon
                                size={20}
                                variant="mini"
                                primaryColor="#137fec"
                                eyeColor="#22d3ee"
                              />
                              <span className="text-xs font-bold text-[#FAFAFA] tracking-wide">
                                Lumina AI is writing...
                              </span>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* DASHBOARD VIEW (step 5) */
                <motion.div
                  key="dashboard-workspace"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={springTransition}
                  className="flex-grow flex flex-col h-full p-6 sm:p-8 justify-between"
                >
                  <div className="flex items-center justify-between mb-5">
                    <h3 className="text-xs font-bold text-[#FAFAFA] uppercase tracking-wider flex items-center gap-2">
                      <GridViewIcon
                        className="text-violet-400"
                        style={{ fontSize: 15 }}
                      />
                      <span>Today's Focus Workspace</span>
                    </h3>
                    <span className="text-[9px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-medium">
                      Active Sprint Session
                    </span>
                  </div>

                  {/* Dashboard Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex-grow">
                    {/* Card 1: Today's Focus */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...springTransition, delay: 0.1 }}
                      className="bg-[#111827]/50 border border-[rgba(255,255,255,0.06)] rounded-2xl p-4 flex flex-col justify-between"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-bold text-[#A1A1AA] uppercase tracking-wider">
                          Today's Focus
                        </span>
                        <AccessTimeIcon
                          className="text-violet-400"
                          style={{ fontSize: 14 }}
                        />
                      </div>
                      <div className="my-2">
                        <span className="text-2xl font-bold text-[#FAFAFA]">
                          3h 45m
                        </span>
                        <p className="text-[9px] text-[#A1A1AA] mt-0.5">
                          Focused flow time scheduled
                        </p>
                      </div>
                      <div className="w-full bg-[#0B0F14] h-1 rounded-full overflow-hidden">
                        <div className="bg-gradient-to-r from-[#7C3AED] to-[#A855F7] h-full w-[75%]" />
                      </div>
                    </motion.div>

                    {/* Card 2: Progress */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...springTransition, delay: 0.25 }}
                      className="bg-[#111827]/50 border border-[rgba(255,255,255,0.06)] rounded-2xl p-4 flex flex-col justify-between"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-bold text-[#A1A1AA] uppercase tracking-wider">
                          Progress
                        </span>
                        <TrendingUpIcon
                          className="text-emerald-400"
                          style={{ fontSize: 14 }}
                        />
                      </div>
                      <div className="my-2">
                        <span className="text-2xl font-bold text-[#FAFAFA]">
                          80%
                        </span>
                        <p className="text-[9px] text-[#A1A1AA] mt-0.5">
                          4 of 5 habits checked
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <span className="w-2.5 h-1.5 bg-[#7C3AED] rounded-sm" />
                        <span className="w-2.5 h-1.5 bg-[#7C3AED] rounded-sm" />
                        <span className="w-2.5 h-1.5 bg-[#7C3AED] rounded-sm" />
                        <span className="w-2.5 h-1.5 bg-[#7C3AED] rounded-sm" />
                        <span className="w-2.5 h-1.5 bg-[rgba(255,255,255,0.1)] rounded-sm" />
                      </div>
                    </motion.div>

                    {/* Card 3: Upcoming */}
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ ...springTransition, delay: 0.4 }}
                      className="bg-[#111827]/50 border border-[rgba(255,255,255,0.06)] rounded-2xl p-4 flex flex-col justify-between"
                    >
                      <div className="flex justify-between items-start">
                        <span className="text-[9px] font-bold text-[#A1A1AA] uppercase tracking-wider">
                          Upcoming
                        </span>
                        <CalendarMonthIcon
                          className="text-amber-400"
                          style={{ fontSize: 14 }}
                        />
                      </div>
                      <div className="my-2 flex flex-col gap-1">
                        <div className="flex items-center gap-2 justify-between">
                          <span className="text-[10px] font-medium text-[#FAFAFA] truncate">
                            English Practice
                          </span>
                          <span className="text-[9px] font-mono text-amber-300 font-semibold">
                            16:00
                          </span>
                        </div>
                        <div className="flex items-center gap-2 justify-between opacity-50">
                          <span className="text-[10px] text-[#FAFAFA] truncate">
                            Sync with Team
                          </span>
                          <span className="text-[9px] font-mono font-semibold">
                            18:00
                          </span>
                        </div>
                      </div>
                      <span className="text-[8px] text-[#A1A1AA] self-start bg-[#0B0F14] px-1.5 py-0.5 rounded border border-[rgba(255,255,255,0.04)]">
                        2 events remaining
                      </span>
                    </motion.div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* CALENDAR SIDE-PANEL (Slides in on step === 4, styled like Focusly's Right Resizable Sidebar) */}
        <AnimatePresence>
          {step === 4 && (
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={springTransition}
              className="absolute top-0 right-0 h-full w-[290px] bg-[#111827]/98 backdrop-blur-md border-l border-[rgba(255,255,255,0.06)] p-5 flex flex-col justify-between z-10 shadow-[-10px_0_30px_rgba(0,0,0,0.6)]"
            >
              <div className="flex flex-col gap-4 flex-1">
                {/* Drag handle mock bar on left edge to look resizable */}
                <div className="absolute left-0 top-0 bottom-0 w-1 flex items-center justify-center cursor-ew-resize hover:bg-violet-500/20">
                  <div className="w-[2px] h-8 bg-[rgba(255,255,255,0.1)] rounded" />
                </div>

                {/* Header */}
                <div className="flex items-center justify-between border-b border-[rgba(255,255,255,0.06)] pb-3">
                  <span className="text-xs font-bold text-[#FAFAFA] uppercase tracking-wide flex items-center gap-1.5">
                    <CalendarMonthIcon
                      style={{ fontSize: 13 }}
                      className="text-violet-400"
                    />
                    <span>Daily Plan</span>
                  </span>
                  <span className="text-[9px] text-[#A1A1AA] font-mono">
                    Today
                  </span>
                </div>

                {/* Hours Grid */}
                <div className="flex-1 flex flex-col justify-between text-[10px] text-[#A1A1AA] font-mono relative py-1">
                  {/* Mock Time Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                    <div className="w-full border-t border-[rgba(255,255,255,0.3)]" />
                    <div className="w-full border-t border-[rgba(255,255,255,0.3)]" />
                    <div className="w-full border-t border-[rgba(255,255,255,0.3)]" />
                    <div className="w-full border-t border-[rgba(255,255,255,0.3)]" />
                    <div className="w-full border-t border-[rgba(255,255,255,0.3)]" />
                  </div>

                  {/* Calendar Event Cards */}
                  <div className="relative h-full flex flex-col gap-2.5 z-10">
                    {calendarEvents.map((event, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ ...fastSpring, delay: idx * 0.15 }}
                        className={`p-2.5 rounded-xl border flex flex-col gap-0.5 justify-center ${event.color}`}
                      >
                        <span className="font-semibold text-[10px] leading-tight">
                          {event.title}
                        </span>
                        <span className="text-[9px] opacity-70 font-mono">
                          {event.time}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action indicator at bottom of calendar */}
              <div className="mt-4 pt-3 border-t border-[rgba(255,255,255,0.06)] flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-violet-400 animate-ping" />
                <span className="text-[9px] text-[#A1A1AA]">
                  Smart AI Scheduler Active
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
