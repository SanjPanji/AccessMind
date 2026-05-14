# 🧪 Voice Command System — Testing Guide

## Prerequisites

1. ✅ Chrome, Edge, or Firefox (Safari needs MediaRecorder fallback)
2. ✅ Microphone permissions allowed
3. ✅ Dev server running: `npm run dev` (port 5174)
4. ✅ Browser DevTools open (F12) for console logs

---

## 🎯 Test Cases

### Test 1: Navigate to Assignments

**Command:** "open assignments" or "go to assignments"

**Expected Behavior:**
1. Microphone activates
2. User speaks command
3. **Console logs:**
   ```
   [VoiceNavigation] 📢 Recognized text: "open assignments"
   [VoiceNavigation] 🎯 Intent match: /assignments (high)
   [VoiceNavigation] ✅ EXECUTING ACTION IMMEDIATELY: /assignments
   [VoiceNavigation] ✅ ACTION COMPLETED: Navigating to /assignments
   ```
4. **UI changes:** Navigate to Assignments page automatically
5. **Audio:** System says "Navigating to /assignments (точное совпадение)"

**❌ WRONG:**
- UI only shows "You said: open assignments" (no navigation)
- No console logs
- Requires manual button click

---

### Test 2: Toggle Dark Mode

**Command:** "dark mode" or "enable dark" or "night mode"

**Expected Behavior:**
1. User speaks command
2. **Console logs:**
   ```
   [VoiceNavigation] 📢 Recognized text: "dark mode"
   [VoiceNavigation] 🎯 Intent match: toggle-dark-mode (high)
   [VoiceNavigation] ✅ EXECUTING ACTION IMMEDIATELY: toggle-dark-mode
   [VoiceNavigation] ✅ ACTION COMPLETED: Dark mode toggled
   ```
3. **UI changes:** Page background switches to dark theme immediately
4. **Audio:** System says "Dark mode toggled (точное совпадение)"

**❌ WRONG:**
- Only shows "You said: dark mode" in text
- Page theme doesn't change
- Requires manual toggle button

---

### Test 3: Increase Font Size

**Command:** "increase font" or "bigger text" or "zoom in"

**Expected Behavior:**
1. User speaks command
2. **Console logs:**
   ```
   [VoiceNavigation] ✅ EXECUTING ACTION IMMEDIATELY: increase-font
   [VoiceNavigation] ✅ ACTION COMPLETED: Font size increased
   ```
3. **UI changes:** All text on page becomes larger (+20%)
4. **Audio:** System says "Font size increased (точное совпадение)"

**Verification:** 
```javascript
// In browser console:
console.log(window.getComputedStyle(document.documentElement).fontSize);
// Should be "120px" after first increase (was "100px")
```

---

### Test 4: Unknown Command (Error Handling)

**Command:** "hello world" or random phrase

**Expected Behavior:**
1. User speaks command
2. **Console logs:**
   ```
   [VoiceNavigation] 📢 Recognized text: "hello world"
   [VoiceNavigation] 🎯 Intent match: UNKNOWN (low)
   [VoiceNavigation] ❌ UNKNOWN INTENT - не удалось распознать команду
   ```
3. **UI shows:** "Not understood" in red box
4. **Audio:** System says "Not understood"
5. **Status:** Red error state in UI

---

### Test 5: Multilingual Commands (Russian)

**Setup:**
1. Open Voice Navigation page
2. Click "RU" language button in top right

**Command:** "открой задания" or "покажи оценки"

**Expected Behavior:**
1. User speaks in Russian
2. **Console logs:**
   ```
   [VoiceNavigation] 📢 Recognized text: "открой задания"
   [VoiceNavigation] 🎯 Intent match: /assignments (high)
   [VoiceNavigation] ✅ EXECUTING ACTION IMMEDIATELY: /assignments
   ```
3. **Navigation:** Page switches to Assignments
4. **Audio:** System speaks in Russian

---

### Test 6: Multilingual Commands (Kazakh)

**Setup:**
1. Click "KK" language button

**Command:** "тапсырмалар" or "профиль"

**Expected Behavior:**
1. Same flow as Russian
2. Commands recognized in Kazakh
3. UI updates in real-time

---

### Test 7: AI Fallback (Complex Commands)

**Setup:**
1. Open DevTools Network tab
2. Check Cerebras API calls

**Command:** "show me my grades from last week"

**Expected Behavior:**
1. Console logs:
   ```
   [CommandParser] No local match, falling back to AI for: "show me my grades from last week"
   [CommandParser] AI match: /grades
   ```
2. Network tab shows: POST request to Cerebras API
3. **UI navigates** to Grades page
4. Response time: 1-3 seconds (slower than local match)

---

### Test 8: Rapid Fire Commands (Stress Test)

**Sequence:**
1. "open assignments"
2. (wait for complete)
3. "open grades"
4. (wait for complete)
5. "toggle dark mode"

**Expected Behavior:**
- Each command executes completely
- No race conditions
- Console shows clear sequence:
  ```
  ✅ ACTION COMPLETED: Navigating to /assignments
  ✅ ACTION COMPLETED: Navigating to /grades
  ✅ ACTION COMPLETED: Dark mode toggled
  ```

---

### Test 9: Browser Compatibility

Test on different browsers:

| Browser | Path | Expected |
|---------|------|----------|
| Chrome | Web Speech API | ✅ Instant |
| Edge | Web Speech API | ✅ Instant |
| Firefox | MediaRecorder + Whisper | ✅ 2-3s delay |
| Safari | MediaRecorder + Whisper | ✅ 2-3s delay (if enabled) |

**Console output in Firefox:**
```
[useSpeech] MediaRecorder path, lang= en
[useSpeech] Recording... (tap again to stop)
[useSpeech] Transcribing with Whisper API...
[useSpeech] Transcript: "open assignments"
```

---

### Test 10: Quick Phrases (Button Click)

**Action:** Click on a quick phrase button (e.g., "open assignments")

**Expected Behavior:**
1. **Console logs:**
   ```
   [VoiceNavigation] 🔄 Quick phrase pressed: "open assignments"
   [VoiceNavigation] ✅ EXECUTING ACTION IMMEDIATELY: /assignments
   ```
2. **Navigation:** Same as voice command
3. **Difference:** No microphone activation

**Purpose:** Quick testing without microphone

---

## 🔍 Console Debugging

### What You Should See (✅ CORRECT)

```javascript
// 1. Command recognized
[VoiceNavigation] 📢 Recognized text: "open dashboard"

// 2. Intent parsed
[VoiceNavigation] 🎯 Intent match: /dashboard (high)

// 3. Immediate execution
[VoiceNavigation] ✅ EXECUTING ACTION IMMEDIATELY: /dashboard

// 4. Action completed
[VoiceNavigation] ✅ ACTION COMPLETED: Navigating to /dashboard
```

### What You Should NOT See (❌ WRONG)

```javascript
// ❌ BAD: Only text, no action
"You said: hello world" (this is NOT a log from the system)

// ❌ BAD: Delayed execution
setTimeout(() => { navigate(...) }, 1500) // OLD CODE — REMOVED!

// ❌ BAD: Stub/placeholder
"Currently reading page..." (without actually initiating TTS)
```

---

## 🛠 Troubleshooting

### Problem: Microphone Not Working

**Solution 1:** Check permissions
```javascript
// In browser console:
navigator.permissions.query({name: 'microphone'})
  .then(perm => console.log(perm.state))
  // Should print: "granted" or "prompt"
```

**Solution 2:** Reset permissions
- Chrome: Settings > Privacy > Microphone > Reset site permissions
- Firefox: Settings > Privacy > Permissions > Microphone > Remove

**Solution 3:** Check browser support
```javascript
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
console.log('Supported:', !!SpeechRecognition);
```

---

### Problem: Commands Not Recognized

**Check 1:** Language mismatch
- Language button shows "EN" but you're speaking Russian
- **Fix:** Click "RU" button

**Check 2:** Pattern not matched
- Run manual pattern test:
```javascript
const pattern = /open (assignments?|tasks?)/i;
console.log(pattern.test("open assignments")); // true
console.log(pattern.test("open task")); // true
console.log(pattern.test("go to assignments")); // false
```

**Check 3:** No API key for Cerebras
- AI fallback fails silently
- Check Network tab for failed requests
- Verify API key in `cerebrasClient.ts`

---

### Problem: Navigation Not Working

**Check 1:** React Router configured correctly
```javascript
// In component:
const navigate = useNavigate();
navigate("/assignments"); // Should work if routes defined
```

**Check 2:** Routes defined in Router
- Check `App.tsx` for all route definitions
- Verify path matches action string

---

## 📊 Performance Metrics

### Expected Response Times

| Action | Time | Status |
|--------|------|--------|
| Microphone activation | < 100ms | ✅ Instant |
| Speech recognition (Chrome) | 0.5-3s | ✅ Fast |
| Local command match | < 10ms | ✅ Instant |
| Navigation action | < 50ms | ✅ Instant |
| AI fallback (Cerebras) | 1-3s | ⚠️ Medium |
| Total pipeline | 1-5s | ✅ Good |

### Measurement

```javascript
// In browser console
performance.now() // Before command
// ... speak command ...
performance.now() // After navigation
// Calculate difference
```

---

## ✅ Final Verification Checklist

Before considering the system "fixed", verify:

- [ ] Command recognition logs appear in console
- [ ] Intent matching logs appear (`🎯 Intent match`)
- [ ] Action execution logs appear (`✅ EXECUTING ACTION`)
- [ ] UI actually changes (navigation, theme, font, etc.)
- [ ] No manual button clicks needed for execution
- [ ] Transcription is intermediate, not final result
- [ ] Audio feedback provided (TTS)
- [ ] Works in all 3 languages (EN, RU, KK)
- [ ] Works in Chrome, Firefox, Safari
- [ ] Error handling works for unknown commands
- [ ] No setTimeout delays in command execution

---

**Last Updated:** May 14, 2026
