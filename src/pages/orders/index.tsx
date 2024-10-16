import { Backdrop, Box, CircularProgress, Paper, Typography, useTheme } from '@mui/material';
import { Button } from '@region-x/components';
import { useEffect, useState } from 'react';

import { Balance, ContributionModal, OrderCard, OrderCreationModal } from '@/components';
import { OrderProcessorModal } from '@/components/Orders/Modals/OrderProcessor';

import { useAccounts } from '@/contexts/account';
import { useOrders } from '@/contexts/orders';
import { useRegions } from '@/contexts/regions';
import { useSaleInfo } from '@/contexts/sales';
import { ContextStatus, Order } from '@/models';

const OrderDashboard = () => {
  const theme = useTheme();

  const { orders, status: orderStatus } = useOrders();
  const { regions } = useRegions();
  const {
    state: { activeAccount },
  } = useAccounts();

  const [ordersToShow, setOrdersToShow] = useState<Order[]>([]);
  const [orderSelected, selectOrder] = useState<Order | undefined>();

  const [orderCreationModalOpen, openOrderCreationModal] = useState(false);
  const [contributionModal, openContributionModal] = useState(false);
  const [processorModal, openProcessorModal] = useState(false);
  const { saleStatus, status: saleInfoStatus } = useSaleInfo();

  useEffect(() => {
    let _orders: Array<Order> = orders.filter(({ processed }) => !processed);

    if (saleInfoStatus === ContextStatus.LOADED) {
      _orders = _orders.filter(({ end }) => end > saleStatus.lastCommittedTimeslice);
    }
    setOrdersToShow(_orders);
  }, [orders, saleInfoStatus, saleStatus]);

  return (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: '1rem' }}>
        <Balance rxNativeBalance rxRcCurrencyBalance />
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Box>
          <Typography variant='subtitle1' sx={{ color: theme.palette.common.black }}>
            Orders Dashboard
          </Typography>
          <Typography variant='subtitle2' sx={{ color: theme.palette.text.primary }}>
            Explorer the orders
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: '1.5rem', height: '2.75rem' }}>
          <Button onClick={() => openOrderCreationModal(true)}>Create New Order</Button>
        </Box>
      </Box>
      {orderStatus === ContextStatus.ERROR ? (
        <Box mt='1rem'>
          <Typography>An error occured while fetching the orders.</Typography>
        </Box>
      ) : orderStatus !== ContextStatus.LOADED ? (
        <Backdrop open>
          <CircularProgress />
        </Backdrop>
      ) : (
        <Box mt='2rem' display='flex' flexWrap='wrap' justifyContent='space-around'>
          {ordersToShow.map((order: Order, index: number) => (
            <Paper key={index} sx={{ padding: '1.5rem', margin: '1rem' }}>
              <OrderCard order={order} />
              <Box display='flex' gap='.5rem' mt='1.5rem'>
                <Button
                  onClick={() => {
                    openProcessorModal(true);
                    selectOrder(order);
                  }}
                  fullWidth
                  disabled={activeAccount === null}
                >
                  Fulfill Order
                </Button>
                <Button
                  fullWidth
                  onClick={() => {
                    openContributionModal(true);
                    selectOrder(order);
                  }}
                  disabled={activeAccount === null}
                >
                  Contribute
                </Button>
              </Box>
            </Paper>
          ))}
        </Box>
      )}

      <OrderCreationModal
        open={orderCreationModalOpen}
        onClose={() => openOrderCreationModal(false)}
      />
      {orderSelected !== undefined && (
        <>
          <ContributionModal
            open={contributionModal}
            onClose={() => openContributionModal(false)}
            order={orderSelected}
          />
          <OrderProcessorModal
            open={processorModal}
            onClose={() => openProcessorModal(false)}
            order={orderSelected}
            regions={regions}
          />
        </>
      )}
    </>
  );
};

export default OrderDashboard;
