import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Modal,
  SafeAreaView,
  Platform,
} from 'react-native';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { INDIAN_SKINCARE_CATALOG, SkincareProduct, ALL_SKINCARE_BRANDS } from '../../data/indianSkincareCatalog';
import { useCartStore } from '../../store/useCartStore';

const { width } = Dimensions.get('window');

export interface SearchProcessFlowProps {
  visible: boolean;
  onClose: () => void;
  onSelectProduct: (product: SkincareProduct) => void;
  initialQuery?: string;
}

type SortOption = 'relevance' | 'price_low' | 'price_high' | 'rating';

export const SearchProcessFlow: React.FC<SearchProcessFlowProps> = ({
  visible,
  onClose,
  onSelectProduct,
  initialQuery = '',
}) => {
  // Step 2 & 3: [Enter Search Query] & [Search Query Submitted]
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [submittedQuery, setSubmittedQuery] = useState(initialQuery);

  // Step 7: [Filter/Sort Results (Optional)]
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [selectedConcern, setSelectedConcern] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('relevance');
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);

  const { addToCart, items: cartMap, updateQty } = useCartStore();

  const skinConcerns = ['All', 'Acne', 'Hydration', 'Pigmentation', 'Sun Protection', 'Skin Barrier'];

  // Popular Trending Searches
  const trendingSearches = [
    'Minimalist Niacinamide',
    'Derma Co 1% Hyaluronic',
    'Plum Green Tea',
    'Salicylic Acid Cleanser',
    'Ceramide Moisturizer',
    'Vitamin C Serum',
  ];

  const handleSearchSubmit = (query: string) => {
    setSearchQuery(query);
    setSubmittedQuery(query);
  };

  // Step 4: [Process Search Query] & Step 5: [Display Search Results]
  const filteredResults = useMemo(() => {
    const q = submittedQuery.toLowerCase().trim();
    if (!q) return [];

    let results = INDIAN_SKINCARE_CATALOG.filter(product => {
      const matchName = product.name.toLowerCase().includes(q);
      const matchBrand = product.brand.toLowerCase().includes(q);
      const matchCategory = product.category.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      const matchKeyActives = product.keyActives?.some(a => a.toLowerCase().includes(q));

      return matchName || matchBrand || matchCategory || matchDesc || matchKeyActives;
    });

    // Apply Brand Filter
    if (selectedBrand !== 'All') {
      results = results.filter(p => p.brand.toLowerCase() === selectedBrand.toLowerCase());
    }

    // Apply Concern Filter
    if (selectedConcern !== 'All') {
      results = results.filter(p =>
        p.name.toLowerCase().includes(selectedConcern.toLowerCase()) ||
        p.description.toLowerCase().includes(selectedConcern.toLowerCase()) ||
        p.category.toLowerCase().includes(selectedConcern.toLowerCase())
      );
    }

    // Apply Sorting
    if (sortBy === 'price_low') {
      results.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_high') {
      results.sort((a, b) => b.price - a.price);
    }

    return results;
  }, [submittedQuery, selectedBrand, selectedConcern, sortBy]);

  // Step 6 (Branch B): [Suggest Alternatives]
  const alternativeSuggestions = useMemo(() => {
    return INDIAN_SKINCARE_CATALOG.slice(0, 4);
  }, []);

  const hasResults = filteredResults.length > 0;
  const isSearchActive = submittedQuery.trim().length > 0;

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <View style={styles.phoneScaffold}>
          {/* ========================================================================= */}
          {/* STEP 2: [Enter Search Query] Top Bar                                      */}
          {/* ========================================================================= */}
          <View style={styles.topSearchHeader}>
            <TouchableOpacity onPress={onClose} style={styles.backBtn} activeOpacity={0.7}>
              <Ionicons name="arrow-back" size={20} color="#0F172A" />
            </TouchableOpacity>

            <View style={styles.searchBarInputContainer}>
              <Ionicons name="search" size={18} color="#085cf0" style={{ marginRight: 8 }} />
              <TextInput
                style={styles.textInput}
                placeholder="Search Serums, Sunscreens, Actives..."
                placeholderTextColor="#94A3B8"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={() => handleSearchSubmit(searchQuery)}
                returnKeyType="search"
                autoFocus
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => { setSearchQuery(''); setSubmittedQuery(''); }} style={styles.clearBtn}>
                  <Ionicons name="close-circle" size={18} color="#94A3B8" />
                </TouchableOpacity>
              )}
            </View>

            <TouchableOpacity
              style={styles.searchActionBtn}
              onPress={() => handleSearchSubmit(searchQuery)}
              activeOpacity={0.8}
            >
              <Text style={styles.searchActionText}>Search</Text>
            </TouchableOpacity>
          </View>

          {/* ========================================================================= */}
          {/* STEP 7: [Filter/Sort Results (Optional)] Horizontal Filter Pill Bar       */}
          {/* ========================================================================= */}
          {isSearchActive && hasResults && (
            <View style={styles.filterPillsRow}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
                {/* Brand Selector */}
                <TouchableOpacity
                  style={[styles.filterChip, selectedBrand !== 'All' && styles.filterChipActive]}
                  onPress={() => setShowFilterDrawer(true)}
                >
                  <Ionicons name="options-outline" size={13} color={selectedBrand !== 'All' ? '#FFFFFF' : '#085cf0'} />
                  <Text style={[styles.filterChipText, selectedBrand !== 'All' && styles.filterChipTextActive]}>
                    Brand: {selectedBrand}
                  </Text>
                </TouchableOpacity>

                {/* Sort Toggle */}
                <TouchableOpacity
                  style={[styles.filterChip, sortBy !== 'relevance' && styles.filterChipActive]}
                  onPress={() => {
                    setSortBy(prev => prev === 'relevance' ? 'price_low' : prev === 'price_low' ? 'price_high' : 'relevance');
                  }}
                >
                  <Ionicons name="swap-vertical" size={13} color={sortBy !== 'relevance' ? '#FFFFFF' : '#64748B'} />
                  <Text style={[styles.filterChipText, sortBy !== 'relevance' && styles.filterChipTextActive]}>
                    {sortBy === 'relevance' ? 'Sort: Relevance' : sortBy === 'price_low' ? 'Price: Low to High' : 'Price: High to Low'}
                  </Text>
                </TouchableOpacity>

                {/* Skin Concern Chips */}
                {skinConcerns.map(concern => (
                  <TouchableOpacity
                    key={concern}
                    style={[styles.filterChip, selectedConcern === concern && styles.filterChipActive]}
                    onPress={() => setSelectedConcern(concern)}
                  >
                    <Text style={[styles.filterChipText, selectedConcern === concern && styles.filterChipTextActive]}>
                      {concern}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Main Body Content */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
            {/* INITIAL STATE: Trending Searches */}
            {!isSearchActive && (
              <View style={styles.initialSearchSection}>
                <Text style={styles.sectionHeader}>🔥 Popular Clinical Searches</Text>
                <View style={styles.trendingGrid}>
                  {trendingSearches.map((item, idx) => (
                    <TouchableOpacity
                      key={idx}
                      style={styles.trendingPill}
                      onPress={() => handleSearchSubmit(item)}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="trending-up" size={14} color="#085cf0" style={{ marginRight: 6 }} />
                      <Text style={styles.trendingPillText}>{item}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <Text style={[styles.sectionHeader, { marginTop: 24 }]}>🏷️ Browse by Clinical Category</Text>
                <View style={styles.categoryCardsRow}>
                  {['Serums', 'Moisturizers', 'Suncare', 'Cleansers'].map(cat => (
                    <TouchableOpacity
                      key={cat}
                      style={styles.categoryCard}
                      onPress={() => handleSearchSubmit(cat)}
                      activeOpacity={0.85}
                    >
                      <Text style={styles.categoryCardTitle}>{cat}</Text>
                      <Text style={styles.categoryCardSub}>12-Min Delivery</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {/* ========================================================================= */}
            {/* STEP 5: [Display Search Results] (Thumbs-up / Relevant Path)              */}
            {/* ========================================================================= */}
            {isSearchActive && hasResults && (
              <View style={styles.resultsSection}>
                <View style={styles.resultsHeaderRow}>
                  <Text style={styles.resultsCountText}>
                    Found <Text style={{ color: '#085cf0', fontWeight: '900' }}>{filteredResults.length}</Text> matches for "{submittedQuery}"
                  </Text>
                  <Text style={styles.fastDeliveryTag}>⚡ 12-Min Drop</Text>
                </View>

                {filteredResults.map(product => {
                  const qty = cartMap?.[product.id] || 0;
                  return (
                    <TouchableOpacity
                      key={product.id}
                      style={styles.productResultCard}
                      onPress={() => onSelectProduct(product)}
                      activeOpacity={0.9}
                    >
                      <Image source={product.imageSource} style={styles.productThumb} resizeMode="contain" />

                      <View style={styles.productMetaCol}>
                        <View style={styles.brandBadgePill}>
                          <Text style={styles.brandBadgeText}>{product.brand}</Text>
                        </View>
                        <Text style={styles.productTitle} numberOfLines={2}>{product.name}</Text>
                        <Text style={styles.productKeyActives} numberOfLines={1}>
                          {product.keyActives?.join(' • ') || 'Clinical Dermatology Formulation'}
                        </Text>

                        <View style={styles.productPriceRow}>
                          <Text style={styles.productPrice}>₹{product.price}</Text>
                          {product.originalPrice && (
                            <Text style={styles.productOriginalPrice}>₹{product.originalPrice}</Text>
                          )}
                        </View>
                      </View>

                      {/* Quick Add to Cart Button */}
                      <View style={styles.cartActionCol}>
                        {qty === 0 ? (
                          <TouchableOpacity
                            style={styles.addBtn}
                            onPress={() => addToCart(product.id, 1)}
                            activeOpacity={0.8}
                          >
                            <Text style={styles.addBtnText}>+ ADD</Text>
                          </TouchableOpacity>
                        ) : (
                          <View style={styles.qtyPill}>
                            <TouchableOpacity onPress={() => updateQty(product.id, -1)} style={styles.qtyBtn}>
                              <Text style={styles.qtyBtnSymbol}>−</Text>
                            </TouchableOpacity>
                            <Text style={styles.qtyText}>{qty}</Text>
                            <TouchableOpacity onPress={() => updateQty(product.id, 1)} style={styles.qtyBtn}>
                              <Text style={styles.qtyBtnSymbol}>+</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {/* ========================================================================= */}
            {/* STEP 6 (Branch A & B): ["No results found"] & [Suggest Alternatives]      */}
            {/* ========================================================================= */}
            {isSearchActive && !hasResults && (
              <View style={styles.noResultsContainer}>
                {/* No Results Card */}
                <View style={styles.noResultsCard}>
                  <View style={styles.noResultsIconCircle}>
                    <Ionicons name="search-outline" size={32} color="#EF4444" />
                  </View>
                  <Text style={styles.noResultsTitle}>No results found</Text>
                  <Text style={styles.noResultsSub}>
                    We couldn't find exact matches for "<Text style={{ fontWeight: '700' }}>{submittedQuery}</Text>".
                  </Text>
                  <TouchableOpacity
                    style={styles.tryAnotherBtn}
                    onPress={() => { setSearchQuery(''); setSubmittedQuery(''); }}
                    activeOpacity={0.8}
                  >
                    <Ionicons name="refresh" size={14} color="#085cf0" style={{ marginRight: 6 }} />
                    <Text style={styles.tryAnotherBtnText}>Enter New Search Query</Text>
                  </TouchableOpacity>
                </View>

                {/* [Suggest Alternatives] Flow Node */}
                <View style={styles.alternativesSection}>
                  <View style={styles.alternativesHeaderRow}>
                    <Ionicons name="sparkles" size={16} color="#085cf0" />
                    <Text style={styles.alternativesTitle}>Suggested Alternatives</Text>
                  </View>
                  <Text style={styles.alternativesSub}>Top rated Indian clinical skincare formulas</Text>

                  <View style={styles.alternativesGrid}>
                    {alternativeSuggestions.map(alt => (
                      <TouchableOpacity
                        key={alt.id}
                        style={styles.altCard}
                        onPress={() => onSelectProduct(alt)}
                        activeOpacity={0.88}
                      >
                        <Image source={alt.imageSource} style={styles.altThumb} resizeMode="contain" />
                        <Text style={styles.altBrand}>{alt.brand}</Text>
                        <Text style={styles.altTitle} numberOfLines={1}>{alt.name}</Text>
                        <Text style={styles.altPrice}>₹{alt.price}</Text>
                        <TouchableOpacity
                          style={styles.altAddBtn}
                          onPress={() => addToCart(alt.id, 1)}
                          activeOpacity={0.8}
                        >
                          <Text style={styles.altAddBtnText}>+ ADD</Text>
                        </TouchableOpacity>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Filter Drawer Modal */}
          {showFilterDrawer && (
            <Modal transparent animationType="fade" visible={showFilterDrawer} onRequestClose={() => setShowFilterDrawer(false)}>
              <TouchableOpacity style={styles.filterBackdrop} activeOpacity={1} onPress={() => setShowFilterDrawer(false)}>
                <View style={styles.filterDrawer}>
                  <Text style={styles.filterDrawerTitle}>Filter by Brand</Text>
                  <ScrollView style={{ maxHeight: 280 }}>
                    {['All', ...ALL_SKINCARE_BRANDS].map(brand => (
                      <TouchableOpacity
                        key={brand}
                        style={[styles.brandSelectItem, selectedBrand === brand && styles.brandSelectItemActive]}
                        onPress={() => {
                          setSelectedBrand(brand);
                          setShowFilterDrawer(false);
                        }}
                      >
                        <Text style={[styles.brandSelectText, selectedBrand === brand && styles.brandSelectTextActive]}>
                          {brand}
                        </Text>
                        {selectedBrand === brand && <Ionicons name="checkmark" size={18} color="#085cf0" />}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </TouchableOpacity>
            </Modal>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default SearchProcessFlow;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneScaffold: {
    width: '100%',
    maxWidth: 430,
    height: '100%',
    backgroundColor: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
  },
  topSearchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 10,
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBarInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  textInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    paddingVertical: 0,
  },
  clearBtn: {
    padding: 2,
  },
  searchActionBtn: {
    backgroundColor: '#085cf0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 9,
  },
  searchActionText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },
  filterPillsRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#FFFFFF',
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 4,
  },
  filterChipActive: {
    backgroundColor: '#085cf0',
    borderColor: '#085cf0',
  },
  filterChipText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#334155',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  initialSearchSection: {
    marginTop: 8,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 12,
  },
  trendingGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  trendingPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F6FF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  trendingPillText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#085cf0',
  },
  categoryCardsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  categoryCard: {
    width: '48%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryCardTitle: {
    fontSize: 13,
    fontWeight: '900',
    color: '#0F172A',
  },
  categoryCardSub: {
    fontSize: 10,
    color: '#10B981',
    fontWeight: '700',
    marginTop: 2,
  },
  resultsSection: {
    gap: 12,
  },
  resultsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  resultsCountText: {
    fontSize: 12,
    color: '#64748B',
  },
  fastDeliveryTag: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '800',
  },
  productResultCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    alignItems: 'center',
  },
  productThumb: {
    width: 60,
    height: 60,
    borderRadius: 10,
    backgroundColor: '#F8FAFC',
  },
  productMetaCol: {
    flex: 1,
    marginLeft: 12,
  },
  brandBadgePill: {
    backgroundColor: '#F1F5F9',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    alignSelf: 'flex-start',
    marginBottom: 2,
  },
  brandBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: '#64748B',
  },
  productTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  productKeyActives: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 2,
  },
  productPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  productPrice: {
    fontSize: 13,
    fontWeight: '900',
    color: '#085cf0',
  },
  productOriginalPrice: {
    fontSize: 10,
    color: '#94A3B8',
    textDecorationLine: 'line-through',
  },
  cartActionCol: {
    marginLeft: 8,
  },
  addBtn: {
    backgroundColor: '#085cf0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },
  qtyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 6,
  },
  qtyBtn: {
    paddingHorizontal: 4,
  },
  qtyBtnSymbol: {
    fontSize: 13,
    fontWeight: '900',
    color: '#085cf0',
  },
  qtyText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0F172A',
  },
  noResultsContainer: {
    alignItems: 'center',
    paddingTop: 10,
  },
  noResultsCard: {
    width: '100%',
    backgroundColor: '#FEF2F2',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FEE2E2',
    marginBottom: 20,
  },
  noResultsIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  noResultsTitle: {
    fontSize: 16,
    fontWeight: '900',
    color: '#991B1B',
  },
  noResultsSub: {
    fontSize: 12,
    color: '#B91C1C',
    textAlign: 'center',
    marginTop: 4,
  },
  tryAnotherBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#DBEAFE',
  },
  tryAnotherBtnText: {
    color: '#085cf0',
    fontSize: 12,
    fontWeight: '800',
  },
  alternativesSection: {
    width: '100%',
  },
  alternativesHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  alternativesTitle: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0F172A',
  },
  alternativesSub: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 12,
  },
  alternativesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  altCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  altThumb: {
    width: 70,
    height: 70,
    marginBottom: 6,
  },
  altBrand: {
    fontSize: 9,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
  },
  altTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0F172A',
    textAlign: 'center',
    marginVertical: 2,
  },
  altPrice: {
    fontSize: 12,
    fontWeight: '900',
    color: '#085cf0',
    marginBottom: 6,
  },
  altAddBtn: {
    backgroundColor: '#085cf0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 5,
    width: '100%',
    alignItems: 'center',
  },
  altAddBtnText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  filterBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  filterDrawer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: 380,
  },
  filterDrawerTitle: {
    fontSize: 15,
    fontWeight: '900',
    color: '#0F172A',
    marginBottom: 14,
  },
  brandSelectItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  brandSelectItemActive: {
    backgroundColor: '#F0F6FF',
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  brandSelectText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '600',
  },
  brandSelectTextActive: {
    color: '#085cf0',
    fontWeight: '800',
  },
});
