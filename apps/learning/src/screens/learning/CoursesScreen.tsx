import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useQuery } from 'convex/react';
import { api } from '../../../../../convex/_generated/api';
import { useTheme } from '../../theme';
import { Feather } from '@expo/vector-icons';

export function CoursesScreen() {
    const navigation = useNavigation<any>();
    const { colors } = useTheme();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

    // Get categories and courses
    const categories = useQuery(api.courses.getCourseCategories);
    const courses = useQuery(api.courses.getCourses, {
        categoryId: selectedCategory ?? undefined,
        searchTerm: searchTerm || undefined,
    });

    const renderCourseItem = ({ item }: { item: any }) => (
        <TouchableOpacity 
            style={[styles.courseCard, { backgroundColor: colors.surface }]}
            onPress={() => navigation.navigate('CourseDetail', { courseId: item._id })}
        >
            <Image 
                source={{ uri: item.thumbnailUrl || 'https://via.placeholder.com/150' }} 
                style={styles.courseThumbnail} 
            />
            <View style={styles.courseInfo}>
                <View style={styles.badgeContainer}>
                    <View style={[styles.difficultyBadge, { backgroundColor: colors.primary + '20' }]}>
                        <Text style={[styles.difficultyText, { color: colors.primary }]}>{item.difficulty}</Text>
                    </View>
                    <Text style={[styles.durationText, { color: colors.textSecondary }]}>{item.duration} mins</Text>
                </View>
                <Text style={[styles.courseTitle, { color: colors.text }]} numberOfLines={2}>{item.title}</Text>
                <Text style={[styles.ageRange, { color: colors.textSecondary }]}>Ages {item.ageRange.min}-{item.ageRange.max}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderCategoryItem = ({ item }: { item: any }) => (
        <TouchableOpacity 
            style={[
                styles.categoryButton, 
                { backgroundColor: selectedCategory === item._id ? colors.primary : colors.surface }
            ]}
            onPress={() => setSelectedCategory(selectedCategory === item._id ? null : item._id)}
        >
            <Text style={[
                styles.categoryText, 
                { color: selectedCategory === item._id ? '#ffffff' : colors.text }
            ]}>
                {item.name}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <View style={[styles.searchBar, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                    <Feather name="search" size={20} color={colors.textSecondary} />
                    <TextInput
                        style={[styles.searchInput, { color: colors.text }]}
                        placeholder="Search courses..."
                        placeholderTextColor={colors.placeholderText}
                        value={searchTerm}
                        onChangeText={setSearchTerm}
                    />
                </View>
            </View>

            <View style={styles.categoriesSection}>
                <FlatList
                    data={categories}
                    renderItem={renderCategoryItem}
                    keyExtractor={(item) => item._id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.categoriesList}
                />
            </View>

            <FlatList
                data={courses}
                renderItem={renderCourseItem}
                keyExtractor={(item) => item._id}
                numColumns={2}
                contentContainerStyle={styles.coursesList}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Feather name="book-open" size={48} color={colors.textMuted} />
                        <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
                            No courses found matching your criteria.
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 16,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
    },
    searchInput: {
        flex: 1,
        marginLeft: 8,
        fontSize: 16,
    },
    categoriesSection: {
        marginBottom: 8,
    },
    categoriesList: {
        paddingHorizontal: 16,
    },
    categoryButton: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 10,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    categoryText: {
        fontSize: 14,
        fontWeight: '600',
    },
    coursesList: {
        padding: 8,
    },
    courseCard: {
        flex: 1,
        margin: 8,
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    courseThumbnail: {
        width: '100%',
        height: 120,
    },
    courseInfo: {
        padding: 12,
    },
    badgeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 6,
    },
    difficultyBadge: {
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    difficultyText: {
        fontSize: 10,
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    durationText: {
        fontSize: 10,
    },
    courseTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        height: 40,
    },
    ageRange: {
        fontSize: 12,
        marginTop: 4,
    },
    emptyContainer: {
        marginTop: 100,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
        textAlign: 'center',
    },
});

export default CoursesScreen;
