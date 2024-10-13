import {
  Box,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import { AmountInput, Button } from '@region-x/components';
import { useState } from 'react';

import { useSubmitExtrinsic } from '@/hooks/submitExtrinsic';
import theme from '@/utils/muiTheme';

import { AddressInput } from '@/components/Elements';
import { RegionOverview } from '@/components/Regions';

import { getIcon } from '@/assets/networks';
import { useAccounts } from '@/contexts/account';
import { useCoretimeApi } from '@/contexts/apis';
import { useRegionXApi } from '@/contexts/apis/RegionXApi';
import { useMarket } from '@/contexts/market';
import { useNetwork } from '@/contexts/network';
import { useRegions } from '@/contexts/regions';
import { useToast } from '@/contexts/toast';
import { RegionMetadata } from '@/models';

import styles from './index.module.scss';

interface SellModalProps extends DialogProps {
  onClose: () => void;
  regionMetadata: RegionMetadata;
}

export const SellModal = ({ open, onClose, regionMetadata }: SellModalProps) => {
  const {
    state: { activeAccount, activeSigner },
  } = useAccounts();
  const {
    state: { api: regionXApi, isApiReady: isRegionXReady, symbol },
  } = useRegionXApi();

  const {
    state: { decimals },
  } = useCoretimeApi();

  const { network } = useNetwork();

  const { fetchRegions } = useRegions();
  const { fetchMarket } = useMarket();
  const { toastError, toastInfo, toastSuccess, toastWarning } = useToast();
  const { submitExtrinsicWithFeeInfo } = useSubmitExtrinsic();

  const [price, setPrice] = useState<number | undefined>();
  const [saleRecipient, setSaleRecipient] = useState<string>('');
  const [working, setWorking] = useState(false);

  const listOnSale = async () => {
    if (!activeAccount || !activeSigner || !regionXApi || !isRegionXReady) {
      toastWarning('Please connect your wallet and check the network connection.');
      return;
    }

    if (price === undefined) {
      toastWarning('Please input the price');
      return;
    }

    if (!saleRecipient) {
      toastWarning('Please input the sale recipient');
      return;
    }

    const regionId = regionMetadata.region.getOnChainRegionId();
    const end = regionMetadata.region.getEnd();
    const durationInTimeslices = end - regionId.begin;
    const pricePerTimeslice = price / durationInTimeslices;
    const txListOnMarket = regionXApi.tx.market.listRegion(
      regionId,
      Math.floor(pricePerTimeslice * Math.pow(10, decimals)),
      saleRecipient
    );

    submitExtrinsicWithFeeInfo(
      symbol,
      decimals,
      txListOnMarket,
      activeAccount.address,
      activeSigner,
      {
        ready: () => {
          setWorking(true);
          toastInfo('Transaction was initiated');
        },
        inBlock: () => toastInfo('In Block'),
        finalized: () => setWorking(false),
        success: () => {
          toastSuccess('Successfully listed the region for sale');
          onClose();
          fetchRegions();
          fetchMarket();
        },
        fail: () => {
          toastError(`Failed to list the region`);
        },
        error: (e) => {
          toastError(
            `Failed to list the region. Error: ${
              e.errorMessage === 'Error' ? 'Please check your balance' : e.errorMessage
            }`
          );
          setWorking(false);
        },
      }
    );
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='md'>
      <DialogContent className={styles.container}>
        <Typography variant='subtitle1' sx={{ color: theme.palette.common.black }}>
          List on Market
        </Typography>
        <Typography
          variant='subtitle2'
          sx={{
            color: theme.palette.text.primary,
            textWrap: 'wrap',
            maxWidth: '35rem',
          }}
        >
          Sell your region on the RegionX community market.
        </Typography>
        <Stack direction='column' gap={3}>
          <Box className={styles.content}>
            <RegionOverview regionMetadata={regionMetadata} />
          </Box>
          <Paper className={styles.wrapper}>
            <Stack direction='column' gap={2}>
              <AmountInput
                onAmountChange={(a) => setPrice(Number(a))}
                currencyOptions={[
                  {
                    value: symbol,
                    label: symbol,
                    icon: (
                      <img
                        src={getIcon(network)?.src}
                        style={{ width: '28px', height: '28px', padding: '4px' }}
                      />
                    ),
                  },
                ]}
                label=''
              />
            </Stack>
            <Stack direction='column' gap={2}>
              <AddressInput label='Recipient' onChange={setSaleRecipient} address={saleRecipient} />
            </Stack>
          </Paper>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color='dark'>
          Cancel
        </Button>
        <Button onClick={listOnSale} loading={working}>
          List on sale
        </Button>
      </DialogActions>
    </Dialog>
  );
};
