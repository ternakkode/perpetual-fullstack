import { useEffect } from 'react';
import { useHyperliquidSDKStore } from './useHyperliquidSDKStore';
import { useUserSelectionStore, createSelectedAssetFromWebData2 } from './useUserSelectionStore';

/**
 * Hook to automatically sync selected asset data when HyperliquidSDKStore updates
 * This ensures the selected asset always has the latest data from webData2 and allMids
 */
export const useUserSelectionSync = () => {
  const { webData2, allMids } = useHyperliquidSDKStore();
  const { selectedAsset, setSelectedAsset, getStoredAssetInfo } = useUserSelectionStore();

  useEffect(() => {
    // When data first becomes available and no asset is selected
    if (!selectedAsset && webData2 && allMids) {
      // Try to get asset from URL or localStorage
      const storedAssetInfo = getStoredAssetInfo();
      
      if (storedAssetInfo?.name) {
        // Try to load the stored asset
        const storedAssetData = createSelectedAssetFromWebData2(storedAssetInfo.name, webData2, allMids);
        if (storedAssetData) {
          setSelectedAsset(storedAssetData);
          return;
        }
      }
      
      // Fallback to BTC if no stored asset or stored asset not found
      const btcAssetData = createSelectedAssetFromWebData2("BTC", webData2, allMids);
      if (btcAssetData) {
        setSelectedAsset(btcAssetData);
        return;
      }
    }

    // Only sync if we have a selected asset and fresh data from SDK
    if (!selectedAsset || !webData2 || !allMids) {
      return;
    }

    // Create updated asset data with latest information
    const updatedAssetData = createSelectedAssetFromWebData2(
      selectedAsset.name,
      webData2,
      allMids
    );

    if (updatedAssetData) {
      // Preserve the original selection timestamp
      updatedAssetData.selectedAt = selectedAsset.selectedAt;
      
      // Update the store with fresh data
      setSelectedAsset(updatedAssetData);
    }
  }, [webData2, allMids, selectedAsset?.name, setSelectedAsset]);

  return {
    selectedAsset,
    isDataAvailable: !!(webData2 && allMids),
    isLoading: !webData2 || !allMids || !selectedAsset,
  };
};