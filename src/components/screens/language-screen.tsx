import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppColors } from '@/constants/app-theme';
import { LANGUAGE_OPTIONS } from '@/constants/languages';
import { useProgress } from '@/hooks/use-progress';
import type { LanguageCode } from '@/types/learning';

export function LanguageScreen() {
  const { progress, setLanguages } = useProgress();
  const [objetivo, setObjetivo] = useState<LanguageCode>(
    LANGUAGE_OPTIONS.some((option) => option.code === progress.idiomaObjetivo)
      ? progress.idiomaObjetivo
      : 'en',
  );

  const save = () => {
    setLanguages('es', objetivo);
    router.replace('/');
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'right', 'bottom', 'left']}>
      <ScrollView contentContainerStyle={styles.page}>
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>‹ Volver</Text>
        </Pressable>
        <Text style={styles.title}>Idiomas</Text>
        <Text style={styles.subtitle}>Tu progreso se guarda por separado para cada idioma.</Text>

        <Text style={styles.sectionTitle}>Idioma de apoyo</Text>
        <View style={[styles.option, styles.selected]}>
          <Text style={styles.flag}>🇪🇸</Text>
          <Text style={styles.label}>Español</Text>
        </View>

        <Text style={styles.sectionTitle}>Quiero aprender:</Text>
        <View style={styles.grid}>
          {LANGUAGE_OPTIONS.map(option => (
              <Pressable
                key={`objetivo-${option.code}`}
                accessibilityRole="radio"
                accessibilityState={{ checked: objetivo === option.code }}
                style={[styles.option, objetivo === option.code && styles.selected]}
                onPress={() => setObjetivo(option.code)}
              >
                <Text style={styles.flag}>{option.flag}</Text>
                <Text style={styles.label}>{option.label}</Text>
              </Pressable>
          ))}
        </View>

        <Pressable style={styles.saveButton} onPress={save}>
          <Text style={styles.saveButtonText}>Guardar</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: AppColors.background },
  page: { padding: 20, gap: 14, maxWidth: 720, width: '100%', alignSelf: 'center', paddingBottom: 60 },
  back: { color: AppColors.primaryBright, fontWeight: '800' },
  title: { color: AppColors.text, fontSize: 28, fontWeight: '900', marginTop: 10 },
  subtitle: { color: AppColors.textMuted, marginBottom: 12 },
  sectionTitle: { color: AppColors.text, fontSize: 20, fontWeight: '800', marginTop: 10 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  option: { backgroundColor: AppColors.surface, borderRadius: 16, padding: 12, flexDirection: 'row', alignItems: 'center', gap: 8, width: '48%' },
  selected: { borderWidth: 2, borderColor: AppColors.primary },
  flag: { fontSize: 24 },
  label: { color: AppColors.text, fontSize: 16, fontWeight: '800' },
  saveButton: { backgroundColor: AppColors.primary, borderRadius: 14, padding: 16, width: '100%', alignItems: 'center', marginTop: 24 },
  saveButtonText: { color: AppColors.text, fontWeight: '900', fontSize: 18 }
});
