import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppColors } from '@/constants/app-theme';
import { LANGUAGE_OPTIONS } from '@/constants/languages';
import { useProgress } from '@/hooks/use-progress';
import type { LanguageCode } from '@/types/learning';

const STEPS = [
  'Bienvenido a LinguaFox 🦊',
  'Practica con lecciones, audio y quizzes',
  'En inglés, habla con Fox y personajes originales',
  'Elige tu idioma'
];

export function OnboardingScreen() {
  const { completeOnboarding, setLanguages } = useProgress();
  const [step, setStep] = useState(0);
  const [objetivo, setObjetivo] = useState<LanguageCode>('en');

  const finish = (): void => {
    setLanguages('es', objetivo);
    completeOnboarding();
    router.replace('/');
  };

  return (
    <SafeAreaView style={s.safe}>
      <ScrollView contentContainerStyle={s.page}>
        <Text style={s.logo}>🦊</Text>
        <Text style={s.title}>{STEPS[step]}</Text>

        {step === 3 ? (
          <View style={s.optionsContainer}>
            <Text style={s.sectionTitle}>Idioma de apoyo: 🇪🇸 Español</Text>

            <Text style={s.sectionTitle}>Quiero aprender:</Text>
            <View style={s.grid}>
              {LANGUAGE_OPTIONS.map(option => (
                  <Pressable
                    key={`objetivo-${option.code}`}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: objetivo === option.code }}
                    style={[s.option, s.optionObjective, objetivo === option.code && s.selected]}
                    onPress={() => setObjetivo(option.code)}
                  >
                    <Text style={s.flag}>{option.flag}</Text>
                    <Text style={s.label}>{option.label}</Text>
                  </Pressable>
              ))}
            </View>
          </View>
        ) : (
          <Text style={s.copy}>
            {step === 0 ? 'Aprende a tu ritmo, gana estrellas y mantén tu racha.'
              : step === 1 ? 'Escucha la pronunciación y repasa con feedback inmediato.'
              : 'Conversaciones guiadas y divertidas, sin presión.'}
          </Text>
        )}

        <Pressable style={s.button} onPress={step === 3 ? finish : () => setStep(value => value + 1)}>
          <Text style={s.buttonText}>{step === 3 ? 'Empezar' : 'Siguiente'}</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: AppColors.background },
  page: { padding: 28, alignItems: 'center', justifyContent: 'center', gap: 20, maxWidth: 600, width: '100%', alignSelf: 'center', minHeight: '100%' },
  logo: { fontSize: 72 },
  title: { color: AppColors.text, fontSize: 28, fontWeight: '900', textAlign: 'center' },
  copy: { color: AppColors.textMuted, fontSize: 17, textAlign: 'center', lineHeight: 25 },
  optionsContainer: { width: '100%', gap: 15 },
  sectionTitle: { color: AppColors.text, fontSize: 18, fontWeight: '800' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
  option: { backgroundColor: AppColors.surface, borderRadius: 14, padding: 12, alignItems: 'center', flexDirection: 'row', gap: 6 },
  optionObjective: { width: '45%' },
  selected: { borderColor: AppColors.primary, borderWidth: 2 },
  flag: { fontSize: 24 },
  label: { color: AppColors.text, fontWeight: '800', fontSize: 16 },
  button: { backgroundColor: AppColors.primary, borderRadius: 14, padding: 16, width: '100%', alignItems: 'center', marginTop: 12 },
  buttonText: { color: AppColors.text, fontWeight: '900', fontSize: 16 }
});
