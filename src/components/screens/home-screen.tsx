import { router } from 'expo-router';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useEffect, useMemo, useState } from 'react';

import { ScreenContainer } from '@/components/screen-container';
import { getLanguageName, LANGUAGE_OPTIONS } from '@/constants/languages';
import { useTheme, type ThemeColors } from '@/theme/theme-context';
import { getLessonsByLanguage, getProgressKey } from '@/data/lessons';
import { useProgress } from '@/hooks/use-progress';
import { clearLinguaFoxLocalData } from '@/services/local-data';
import { levelFromXp, xpIntoLevel } from '@/utils/rewards';
import { ACHIEVEMENTS } from '@/data/achievements';

export function HomeScreen() {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const { progress, isHydrated, latestAchievementId, resetProgress } = useProgress();
  const [toast, setToast] = useState<string | null>(null);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const languageName = getLanguageName(progress.idiomaObjetivo);
  const languageOption = LANGUAGE_OPTIONS.find((option) => option.code === progress.idiomaObjetivo);
  const hasEnglishTutor = progress.idiomaObjetivo === 'en';
  useEffect(()=>{if(!latestAchievementId)return;const title=ACHIEVEMENTS.find(a=>a.id===latestAchievementId)?.titulo;const timer=setTimeout(()=>{setToast(title ?? null);setTimeout(()=>setToast(null),3500);},0);return()=>clearTimeout(timer);},[latestAchievementId]);
  const lessons = getLessonsByLanguage(progress.idiomaObjetivo);
  const completedLessons = lessons.filter((lesson) =>
    progress.leccionesCompletadas.includes(getProgressKey(lesson.language, lesson.id)),
  ).length;
  const coursePercent = lessons.length === 0 ? 0 : Math.round((completedLessons / lessons.length) * 100);

  const eraseLocalData = async (): Promise<void> => {
    try {
      await clearLinguaFoxLocalData();
      setShowPrivacy(false);
      resetProgress();
    } catch (error: unknown) {
      console.warn('No se pudieron borrar los datos locales de LinguaFox.', error);
      Alert.alert('No se pudieron borrar los datos', 'Vuelve a intentarlo desde esta pantalla.');
    }
  };

  const confirmEraseLocalData = (): void => {
    Alert.alert(
      '¿Borrar todos los datos locales?',
      'Se eliminarán el progreso, las estrellas y los historiales de conversación de este dispositivo.',
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Borrar', style: 'destructive', onPress: () => void eraseLocalData() },
      ],
    );
  };

  return (
    <ScreenContainer title="LinguaFox" isLoading={!isHydrated}>
      <Text style={styles.subtitle}>Aprende {languageName} paso a paso</Text>
      <Pressable style={styles.languageButton} onPress={() => router.push('/language')}><Text style={styles.languageText}>{languageOption ? `${languageOption.flag} ${languageOption.label}` : '🇬🇧 Inglés'} · Cambiar</Text></Pressable>
      <View style={styles.courseSummary} accessibilityLabel={`${coursePercent}% del curso completado`}>
        <View style={styles.courseSummaryHeader}>
          <Text style={styles.courseSummaryTitle}>Tu curso</Text>
          <Text style={styles.courseSummaryValue}>{completedLessons}/{lessons.length} lecciones</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${coursePercent}%` }]} />
        </View>
      </View>
      <View style={styles.starsSummary} accessibilityLabel={`${progress.estrellas} estrellas totales`}>
        <Text style={styles.starsIcon}>★</Text>
        <View>
          <Text style={styles.starsTotal}>{progress.estrellas}</Text>
          <Text style={styles.starsLabel}>estrellas conseguidas</Text>
        </View>
      </View>
      {toast?<View style={styles.toast}><Text style={styles.toastText}>🏆 Logro desbloqueado: {toast}</Text></View>:null}
      <Pressable style={styles.achievementsButton} onPress={()=>router.push('/achievements')}><Text style={styles.languageText}>🏆 Ver logros</Text></Pressable>
      <View style={styles.gameRow}><Text style={styles.gameText}>🔥 {progress.rachaActual} días</Text><Text style={styles.gameText}>Nivel {levelFromXp(progress.experiencia)} · {xpIntoLevel(progress.experiencia)}/100 XP</Text></View>
      {hasEnglishTutor ? (
        <>
          <Pressable
            style={({ pressed }) => [styles.tutorCard, pressed && styles.pressed]}
            onPress={() => router.push('/chat')}>
            <Text style={styles.tutorAvatar}>🦊</Text>
            <View style={styles.tutorCopy}>
              <Text style={styles.tutorTitle}>Charlar con el tutor</Text>
              <Text style={styles.tutorDescription}>Practica inglés con Fox en una conversación guiada.</Text>
            </View>
            <Text style={styles.tutorArrow}>›</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.charactersCard, pressed && styles.pressed]}
            onPress={() => router.push('/characters')}>
            <Text style={styles.tutorAvatar}>🦸</Text>
            <View style={styles.tutorCopy}>
              <Text style={styles.tutorTitle}>Charlar con personajes</Text>
              <Text style={styles.tutorDescription}>Practica con aventuras, comida, deporte y más.</Text>
            </View>
            <Text style={styles.tutorArrow}>›</Text>
          </Pressable>
        </>
      ) : (
        <View style={styles.tutorNotice}>
          <Text style={styles.tutorAvatar}>🦊</Text>
          <View style={styles.tutorCopy}>
            <Text style={styles.tutorTitle}>Tutor conversacional</Text>
            <Text style={styles.tutorDescription}>Disponible actualmente en el curso de inglés. En {languageName} puedes usar lecciones, audio y quizzes.</Text>
          </View>
        </View>
      )}
      {lessons.length === 0 ? (
        <View style={styles.card}>
          <Text style={styles.cardTitle}>No hay lecciones disponibles</Text>
          <Text style={styles.description}>Prueba de nuevo más tarde.</Text>
        </View>
      ) : (
        lessons.map((lesson) => {
          const progressKey = getProgressKey(lesson.language, lesson.id);
          const isCompleted = progress.leccionesCompletadas.includes(progressKey);
          const bestStars = progress.mejoresEstrellasPorLeccion[progressKey] ?? 0;
          const bestScore = progress.mejorPuntuacionPorLeccion[progressKey];

          return (
          <View key={lesson.id} style={[styles.card, isCompleted && styles.completedCard]}>
            <View style={styles.lessonHeader}>
              <Text style={styles.cardTitle}>{lesson.title}</Text>
              <View style={[styles.statusBadge, isCompleted && styles.completedBadge]}>
                <Text style={styles.statusText}>{isCompleted ? '✓ Completada' : 'Pendiente'}</Text>
              </View>
            </View>
            <Text style={styles.description}>{lesson.description}</Text>
            <View style={styles.lessonStats}>
              <Text style={styles.lessonStars} accessibilityLabel={`${bestStars} de 3 estrellas`}>
                {Array.from({ length: 3 }, (_, index) => (index < bestStars ? '★' : '☆')).join(' ')}
              </Text>
              <Text style={styles.bestScore}>
                {bestScore === undefined
                  ? 'Sin intentos'
                  : `Mejor: ${bestScore}/${lesson.words.length}`}
              </Text>
            </View>
            <View style={styles.row}>
              <Pressable
                style={({ pressed }) => [styles.button, pressed && styles.pressed]}
                onPress={() => router.push(`/lesson/${lesson.id}`)}>
                <Text style={styles.buttonText}>Aprender</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  styles.quizButton,
                  pressed && styles.pressed,
                ]}
                onPress={() => router.push(`/quiz/${lesson.id}`)}>
                <Text style={styles.buttonText}>Quiz</Text>
              </Pressable>
            </View>
          </View>
          );
        })
      )}
      <Pressable style={styles.privacyButton} onPress={() => setShowPrivacy(true)}>
        <Text style={styles.privacyButtonText}>Privacidad y datos</Text>
      </Pressable>
      <Modal visible={showPrivacy} animationType="slide" onRequestClose={() => setShowPrivacy(false)}>
        <ScrollView style={styles.privacyRoot} contentContainerStyle={styles.privacyContent}>
          <Text accessibilityRole="header" style={styles.privacyTitle}>Privacidad y datos</Text>
          <Text style={styles.privacyMeta}>LinguaFox · versión 1.0.0 · 23 de agosto de 2026</Text>
          <View style={styles.privacyCard}>
            <Text accessibilityRole="header" style={styles.privacyHeading}>Datos locales</Text>
            <Text selectable style={styles.privacyBody}>El progreso, las preferencias y el historial de conversación se guardan localmente en tu dispositivo. Esta V1 no exige crear una cuenta y no integra publicidad ni analítica.</Text>
          </View>
          <View style={styles.privacyCard}>
            <Text accessibilityRole="header" style={styles.privacyHeading}>Tutor</Text>
            <Text selectable style={styles.privacyBody}>El tutor local funciona sin enviar la conversación a un servidor. La conexión opcional con un proveedor de inteligencia artificial está desactivada por defecto y no debe activarse sin informar al usuario y actualizar esta política.</Text>
          </View>
          <View style={styles.privacyCard}>
            <Text accessibilityRole="header" style={styles.privacyHeading}>Borrar los datos</Text>
            <Text selectable style={styles.privacyBody}>Puedes eliminar desde aquí el progreso, las estrellas y los historiales guardados por LinguaFox en este dispositivo.</Text>
            <Pressable accessibilityRole="button" style={styles.eraseDataButton} onPress={confirmEraseLocalData}>
              <Text style={styles.eraseDataText}>Borrar todos mis datos locales</Text>
            </Pressable>
          </View>
          <Pressable style={styles.closePrivacyButton} onPress={() => setShowPrivacy(false)}>
            <Text style={styles.closePrivacyText}>Cerrar</Text>
          </Pressable>
        </ScrollView>
      </Modal>
    </ScreenContainer>
  );
}

function createStyles(colors: ThemeColors) { return StyleSheet.create({
  subtitle: { color: colors.textMuted, textAlign: 'center', marginBottom: 22, fontSize: 16 },
  languageButton:{alignSelf:'center',backgroundColor:colors.surfaceRaised,borderRadius:999,paddingHorizontal:14,paddingVertical:8,marginTop:-12,marginBottom:14},
  languageText:{color:colors.primaryBright,fontWeight:'800'},
  courseSummary:{backgroundColor:colors.surface,borderRadius:18,padding:16,marginBottom:12,gap:10},
  courseSummaryHeader:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',gap:12},
  courseSummaryTitle:{color:colors.text,fontWeight:'900',fontSize:16},
  courseSummaryValue:{color:colors.primaryBright,fontWeight:'800',fontSize:13},
  progressTrack:{height:8,borderRadius:999,backgroundColor:colors.surfaceRaised,overflow:'hidden'},
  progressFill:{height:'100%',borderRadius:999,backgroundColor:colors.primary},
  achievementsButton:{alignSelf:'center',paddingHorizontal:14,paddingVertical:8,marginBottom:12},
  toast:{backgroundColor:colors.primary,borderRadius:12,padding:12,marginBottom:12},toastText:{color:colors.text,fontWeight:'800',textAlign:'center'},
  starsSummary: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  starsIcon: { color: colors.accent, fontSize: 36 },
  starsTotal: {
    color: colors.text,
    fontSize: 26,
    fontWeight: '900',
    fontVariant: ['tabular-nums'],
  },
  starsLabel: { color: colors.textMuted, fontSize: 13 },
  gameRow:{backgroundColor:colors.surface,borderRadius:14,padding:12,marginBottom:14,flexDirection:'row',justifyContent:'space-between'},
  gameText:{color:colors.primaryBright,fontWeight:'800',fontSize:13},
  tutorCard: {
    backgroundColor: colors.surfaceRaised,
    borderColor: colors.primary,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tutorAvatar: { fontSize: 34 },
  tutorCopy: { flex: 1 },
  tutorTitle: { color: colors.text, fontSize: 17, fontWeight: '800' },
  tutorDescription: { color: colors.textMuted, fontSize: 13, lineHeight: 18, marginTop: 3 },
  tutorArrow: { color: colors.primaryBright, fontSize: 32, lineHeight: 32 },
  charactersCard: {
    backgroundColor: colors.surface,
    borderColor: colors.accent,
    borderWidth: 1,
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tutorNotice: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  card: { backgroundColor: colors.surface, borderRadius: 18, padding: 18, marginBottom: 14 },
  completedCard: { borderColor: colors.primary, borderWidth: 1 },
  lessonHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 },
  cardTitle: { color: colors.text, fontSize: 19, fontWeight: '800' },
  statusBadge: {
    backgroundColor: colors.surfaceRaised,
    borderRadius: 999,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },
  completedBadge: { backgroundColor: colors.success },
  statusText: { color: colors.text, fontSize: 11, fontWeight: '800' },
  description: { color: colors.textMuted, marginTop: 8, marginBottom: 12 },
  lessonStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    gap: 8,
  },
  lessonStars: { color: colors.accent, fontSize: 18, letterSpacing: 1 },
  bestScore: { color: colors.textMuted, fontSize: 13, fontVariant: ['tabular-nums'] },
  row: { flexDirection: 'row', gap: 10 },
  button: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  quizButton: { backgroundColor: colors.accent },
  buttonText: { color: colors.text, fontWeight: '800' },
  privacyButton:{alignSelf:'center',paddingHorizontal:16,paddingVertical:12,marginTop:8},
  privacyButtonText:{color:colors.primaryBright,fontWeight:'800'},
  privacyRoot:{flex:1,backgroundColor:colors.background},
  privacyContent:{width:'100%',maxWidth:680,alignSelf:'center',gap:14,paddingHorizontal:18,paddingTop:40,paddingBottom:40},
  privacyTitle:{color:colors.text,fontSize:26,fontWeight:'900'},
  privacyMeta:{color:colors.textMuted,fontSize:13,marginBottom:4},
  privacyCard:{gap:8,padding:18,borderRadius:18,backgroundColor:colors.surface,borderWidth:1,borderColor:colors.surfaceRaised},
  privacyHeading:{color:colors.primaryBright,fontSize:16,fontWeight:'900'},
  privacyBody:{color:colors.text,fontSize:14,lineHeight:21},
  eraseDataButton:{minHeight:46,alignItems:'center',justifyContent:'center',borderRadius:12,borderWidth:1,borderColor:colors.danger,marginTop:6,paddingHorizontal:12},
  eraseDataText:{color:colors.danger,fontSize:14,fontWeight:'900',textAlign:'center'},
  closePrivacyButton:{minHeight:48,alignItems:'center',justifyContent:'center',borderRadius:14,backgroundColor:colors.primary},
  closePrivacyText:{color:colors.text,fontSize:15,fontWeight:'900'},
  pressed: { opacity: 0.78 },
}); }
