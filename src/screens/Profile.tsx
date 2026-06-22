import { useGame } from '../context/GameContext'
import { useT } from '../i18n'
import { masteryLevel } from '../srs'
import { requestNotificationPermission, notificationsSupported } from '../lib/notifications'
import Achievements from './Achievements'
import StreakCalendar from './StreakCalendar'

export default function Profile({
  onPremium,
  onGrammar,
}: {
  onPremium: () => void
  onGrammar: () => void
}) {
  const { state, dispatch } = useGame()
  const t = useT()
  const cards = Object.values(state.srs)
  const mastered = cards.filter((c) => masteryLevel(c) === 'mastered').length
  const learning = cards.filter((c) => ['learning', 'review'].includes(masteryLevel(c))).length

  const goalPct = Math.min(100, Math.round((state.xpToday / state.dailyGoal) * 100))

  return (
    <div className="profile fade-in">
      <div className="profile-head">
        <div className="avatar">🦊</div>
        <h2>
          {state.name || 'Estudiante'} {state.isPremium && <span title="Premium">👑</span>}
        </h2>
        <span className="level-pill">{state.level}</span>
      </div>

      {!state.isPremium && (
        <button className="premium-cta" onClick={onPremium}>
          <span className="pc-icon">👑</span>
          <span className="pc-text">
            <strong>{t('become_premium')}</strong>
            <small>{t('premium_perk')}</small>
          </span>
          <span className="pc-arrow">›</span>
        </button>
      )}

      <div className="daily-goal-card">
        <div className="dg-top">
          <span>{t('daily_goal')}</span>
          <span>
            {state.xpToday} / {state.dailyGoal} XP
          </span>
        </div>
        <div className="dg-bar">
          <div className="dg-fill" style={{ width: `${goalPct}%` }} />
        </div>
        {goalPct >= 100 && <span className="dg-done">{t('goal_done')}</span>}
      </div>

      <div className="stat-grid">
        <Stat icon="🔥" value={state.streak} label={t('stat_streak')} />
        <Stat icon="⭐" value={state.xp} label={t('stat_total_xp')} />
        <Stat icon="📅" value={state.weeklyXp} label={t('stat_week_xp')} />
        <Stat icon="💎" value={state.gems} label={t('stat_gems')} />
        <Stat icon="📚" value={state.completedLessons.length} label={t('stat_lessons')} />
        <Stat icon="🧠" value={mastered} label={t('stat_mastered')} />
        <Stat icon="📖" value={learning} label={t('stat_learning')} />
        <Stat icon="📕" value={state.readStories.length} label={t('stat_stories')} />
      </div>

      <h3 className="profile-section-title">📅 {t('streak_calendar')}</h3>
      <StreakCalendar />

      <Achievements />

      <div className="settings">
        <button className="setting-row" onClick={onGrammar}>
          <span>📘 {t('grammar')}</span>
          <span className="pc-arrow">›</span>
        </button>
        <button className="setting-row" onClick={onPremium}>
          <span>👑 {state.isPremium ? t('manage_premium') : t('become_premium')}</span>
          <span className="pc-arrow">›</span>
        </button>

        <div className="setting-row">
          <span>🌍 {t('language')}</span>
          <div className="lang-switch">
            <button
              className={`lang-opt ${state.uiLang === 'es' ? 'active' : ''}`}
              onClick={() => dispatch({ type: 'SET_LANG', lang: 'es' })}
            >
              ES
            </button>
            <button
              className={`lang-opt ${state.uiLang === 'en' ? 'active' : ''}`}
              onClick={() => dispatch({ type: 'SET_LANG', lang: 'en' })}
            >
              EN
            </button>
          </div>
        </div>

        <button className="setting-row" onClick={() => dispatch({ type: 'TOGGLE_DARK' })}>
          <span>{state.darkMode ? '🌙' : '☀️'} {t('dark_mode')}</span>
          <span className={`toggle ${state.darkMode ? 'on' : ''}`}>
            <span className="knob" />
          </span>
        </button>

        {notificationsSupported() && (
          <>
            <button
              className="setting-row"
              onClick={async () => {
                if (!state.reminderEnabled) {
                  const ok = await requestNotificationPermission()
                  dispatch({ type: 'SET_REMINDER', enabled: ok })
                  if (!ok) alert('Activa las notificaciones en tu navegador para recibir recordatorios.')
                } else {
                  dispatch({ type: 'SET_REMINDER', enabled: false })
                }
              }}
            >
              <span>🔔 {t('daily_reminder')}</span>
              <span className={`toggle ${state.reminderEnabled ? 'on' : ''}`}>
                <span className="knob" />
              </span>
            </button>
            {state.reminderEnabled && (
              <div className="setting-row reminder-time">
                <span>⏰ {t('reminder_time')}</span>
                <input
                  type="time"
                  className="time-input"
                  value={state.reminderTime}
                  onChange={(e) => dispatch({ type: 'SET_REMINDER', enabled: true, time: e.target.value })}
                />
              </div>
            )}
          </>
        )}

        <button
          className="setting-row danger"
          onClick={() => {
            if (confirm('¿Borrar todo el progreso? Esta acción no se puede deshacer.')) {
              dispatch({ type: 'RESET' })
            }
          }}
        >
          🗑️ {t('reset_progress')}
        </button>
      </div>
    </div>
  )
}

function Stat({ icon, value, label }: { icon: string; value: number; label: string }) {
  return (
    <div className="stat-box">
      <span className="stat-icon">{icon}</span>
      <span className="stat-value">{value}</span>
      <span className="stat-label">{label}</span>
    </div>
  )
}
