import React, { useState, useEffect } from 'react';
import { UserSubscription, Transaction } from '../types';
import { getUserTransactions, cancelSubscription } from '../services/paymentService';

interface BillingViewProps {
  subscription?: UserSubscription;
  onUpgrade?: () => void;
}

export const BillingView: React.FC<BillingViewProps> = ({ subscription, onUpgrade }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    loadTransactions();
  }, []);

  const loadTransactions = async () => {
    setLoading(true);
    try {
      // In production, get actual user ID from auth context
      const userId = 'user_mock_123';
      const data = await getUserTransactions(userId, 10);
      setTransactions(data);
    } catch (error) {
      console.error('Failed to load transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!subscription?.stripeSubscriptionId) return;

    const confirmed = window.confirm(
      'Bist du sicher, dass du dein Abonnement kündigen möchtest? Du behältst den Zugang bis zum Ende der aktuellen Periode.'
    );

    if (!confirmed) return;

    setCancelling(true);
    try {
      const result = await cancelSubscription(subscription.stripeSubscriptionId);
      if (result.success) {
        alert('✓ Abonnement erfolgreich gekündigt');
        // Reload page or update state
      } else {
        alert(`❌ Fehler: ${result.error}`);
      }
    } catch (error) {
      console.error('Cancel error:', error);
      alert('❌ Ein Fehler ist aufgetreten');
    } finally {
      setCancelling(false);
    }
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString('de-DE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatPrice = (cents: number): string => {
    return `€${(cents / 100).toFixed(2)}`;
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
      cancelled: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
      expired: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
      trial: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${
          styles[status as keyof typeof styles] || styles.active
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif text-4xl text-astro-text">Abrechnung & Abos</h1>
          <p className="font-sans text-astro-subtext mt-2">
            Verwalte dein Abonnement und deine Zahlungen
          </p>
        </div>
      </div>

      {/* Current Subscription */}
      <div className="bg-astro-card border border-astro-border rounded-3xl p-8">
        <h2 className="font-serif text-2xl text-astro-text mb-6">Aktuelles Abonnement</h2>

        {subscription ? (
          <div className="space-y-6">
            <div className="flex items-start justify-between">
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-serif text-xl text-astro-text">
                    {subscription.tier.replace('_', ' ')}
                  </h3>
                  {getStatusBadge(subscription.status)}
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <div className="text-sm text-astro-subtext mb-1">Tokens verfügbar</div>
                    <div className="font-serif text-2xl text-astro-gold">
                      {subscription.tokensRemaining.toLocaleString()}
                      <span className="text-sm text-astro-subtext">
                        {' '}
                        / {subscription.tokensTotal.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-astro-subtext mb-1">Nächste Abrechnung</div>
                    <div className="font-sans text-lg text-astro-text">
                      {formatDate(subscription.currentPeriodEnd)}
                    </div>
                  </div>
                </div>

                {/* Token Usage Bar */}
                <div className="w-full bg-astro-border rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-astro-gold h-full transition-all duration-500"
                    style={{
                      width: `${
                        (subscription.tokensRemaining / subscription.tokensTotal) * 100
                      }%`,
                    }}
                  />
                </div>

                <div className="flex gap-3 pt-2">
                  {subscription.status === 'active' && subscription.autoRenew && (
                    <button
                      onClick={handleCancelSubscription}
                      disabled={cancelling}
                      className="px-6 py-2 border border-red-500 text-red-500 rounded-xl font-sans font-semibold hover:bg-red-50 dark:hover:bg-red-900/10 transition-all disabled:opacity-50"
                    >
                      {cancelling ? 'Wird gekündigt...' : 'Abo kündigen'}
                    </button>
                  )}
                  <button
                    onClick={onUpgrade}
                    className="px-6 py-2 bg-astro-gold text-white rounded-xl font-sans font-semibold hover:bg-[#B89628] transition-all"
                  >
                    Plan upgraden
                  </button>
                </div>
              </div>

              <div className="text-6xl">💎</div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">🌟</div>
            <h3 className="font-serif text-xl text-astro-text mb-2">
              Kein aktives Abonnement
            </h3>
            <p className="text-astro-subtext mb-6">
              Upgrade jetzt für unbegrenzten Zugang zu allen Features
            </p>
            <button
              onClick={onUpgrade}
              className="px-8 py-3 bg-astro-gold text-white rounded-xl font-sans font-semibold hover:bg-[#B89628] transition-all"
            >
              Pläne ansehen
            </button>
          </div>
        )}
      </div>

      {/* Transaction History */}
      <div className="bg-astro-card border border-astro-border rounded-3xl p-8">
        <h2 className="font-serif text-2xl text-astro-text mb-6">Transaktionsverlauf</h2>

        {loading ? (
          <div className="text-center py-8 text-astro-subtext">Lade Transaktionen...</div>
        ) : transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 bg-astro-bg rounded-xl border border-astro-border hover:border-astro-gold/50 transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-astro-gold/10 flex items-center justify-center text-xl">
                    {transaction.type === 'token_purchase' ? '🪙' : '💎'}
                  </div>
                  <div>
                    <div className="font-sans text-sm text-astro-text">
                      {transaction.description}
                    </div>
                    <div className="text-xs text-astro-subtext">
                      {formatDate(transaction.timestamp)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-sans text-lg text-astro-text">
                    {formatPrice(transaction.amount)}
                  </div>
                  <div
                    className={`text-xs ${
                      transaction.status === 'completed'
                        ? 'text-green-600'
                        : transaction.status === 'pending'
                        ? 'text-orange-600'
                        : 'text-red-600'
                    }`}
                  >
                    {transaction.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-astro-subtext">
            Noch keine Transaktionen vorhanden
          </div>
        )}
      </div>

      {/* Payment Method (placeholder) */}
      <div className="bg-astro-card border border-astro-border rounded-3xl p-8">
        <h2 className="font-serif text-2xl text-astro-text mb-6">Zahlungsmethode</h2>
        <div className="flex items-center gap-4 p-4 bg-astro-bg rounded-xl border border-astro-border">
          <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">
            VISA
          </div>
          <div>
            <div className="font-sans text-sm text-astro-text">•••• •••• •••• 4242</div>
            <div className="text-xs text-astro-subtext">Läuft ab 12/2026</div>
          </div>
          <button className="ml-auto text-astro-gold text-sm font-semibold hover:underline">
            Ändern
          </button>
        </div>
      </div>
    </div>
  );
};
