import React, { useState } from 'react';
import { TOKEN_PACKAGES, SUBSCRIPTION_PLANS } from '../config/pricing';
import { TokenPackage, SubscriptionPlan } from '../types';
import { processTokenPurchase, processSubscriptionPurchase } from '../services/paymentService';

interface PricingViewProps {
  onPurchaseSuccess?: () => void;
}

export const PricingView: React.FC<PricingViewProps> = ({ onPurchaseSuccess }) => {
  const [activeTab, setActiveTab] = useState<'tokens' | 'subscriptions'>('subscriptions');
  const [processing, setProcessing] = useState<string | null>(null);

  const handleTokenPurchase = async (tokenPackage: TokenPackage) => {
    setProcessing(tokenPackage.id);
    try {
      // In production, get actual user ID from auth context
      const userId = 'user_mock_123';
      const result = await processTokenPurchase(tokenPackage, userId);

      if (result.success) {
        alert(`✨ Erfolgreich! ${tokenPackage.tokens} Tokens gekauft!`);
        onPurchaseSuccess?.();
      } else {
        alert(`❌ Fehler: ${result.error}`);
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert('❌ Ein Fehler ist aufgetreten');
    } finally {
      setProcessing(null);
    }
  };

  const handleSubscriptionPurchase = async (plan: SubscriptionPlan) => {
    setProcessing(plan.id);
    try {
      // In production, get actual user ID from auth context
      const userId = 'user_mock_123';
      const result = await processSubscriptionPurchase(plan, userId);

      if (result.success) {
        // In production, redirect to Stripe Checkout
        // window.location.href = result.sessionUrl;
        alert(`✨ Checkout erstellt für ${plan.name}!`);
        onPurchaseSuccess?.();
      } else {
        alert(`❌ Fehler: ${result.error}`);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('❌ Ein Fehler ist aufgetreten');
    } finally {
      setProcessing(null);
    }
  };

  const formatPrice = (cents: number): string => {
    return `€${(cents / 100).toFixed(2)}`;
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="font-serif text-4xl md:text-5xl text-astro-text">
          Erweitere deine Reise
        </h1>
        <p className="font-sans text-lg text-astro-subtext max-w-2xl mx-auto">
          Wähle Tokens oder ein Abo für unbegrenzten Zugang zu deinen AI Astro Agents
        </p>
      </div>

      {/* Tab Selector */}
      <div className="flex justify-center gap-4">
        <button
          onClick={() => setActiveTab('subscriptions')}
          className={`px-8 py-3 rounded-xl font-sans font-semibold transition-all ${
            activeTab === 'subscriptions'
              ? 'bg-astro-gold text-white shadow-lg'
              : 'bg-astro-card text-astro-subtext hover:bg-astro-border'
          }`}
        >
          Abonnements
        </button>
        <button
          onClick={() => setActiveTab('tokens')}
          className={`px-8 py-3 rounded-xl font-sans font-semibold transition-all ${
            activeTab === 'tokens'
              ? 'bg-astro-gold text-white shadow-lg'
              : 'bg-astro-card text-astro-subtext hover:bg-astro-border'
          }`}
        >
          Token Pakete
        </button>
      </div>

      {/* Subscription Plans */}
      {activeTab === 'subscriptions' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {SUBSCRIPTION_PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-astro-card border-2 rounded-3xl p-8 transition-all hover:shadow-2xl ${
                plan.popular
                  ? 'border-astro-gold scale-105'
                  : 'border-astro-border hover:border-astro-gold/50'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-astro-gold text-white px-6 py-1 rounded-full text-sm font-bold">
                  BELIEBT
                </div>
              )}

              <div className="text-center space-y-4 mb-6">
                <h3 className="font-serif text-2xl text-astro-text">{plan.name}</h3>
                <div className="space-y-1">
                  <div className="font-serif text-4xl text-astro-gold">
                    {formatPrice(plan.price)}
                  </div>
                  <div className="text-sm text-astro-subtext">
                    pro {plan.interval === 'month' ? 'Monat' : plan.interval === 'year' ? 'Jahr' : 'Tag'}
                  </div>
                </div>
                <div className="text-sm text-astro-gold font-semibold">
                  {plan.tokensIncluded.toLocaleString()} Tokens inklusive
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-astro-subtext">
                    <span className="text-astro-gold mt-0.5">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscriptionPurchase(plan)}
                disabled={processing === plan.id}
                className={`w-full py-3 rounded-xl font-sans font-semibold transition-all ${
                  plan.popular
                    ? 'bg-astro-gold text-white hover:bg-[#B89628]'
                    : 'bg-astro-text text-white hover:bg-astro-text/90'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {processing === plan.id ? 'Wird verarbeitet...' : 'Jetzt abonnieren'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Token Packages */}
      {activeTab === 'tokens' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {TOKEN_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative bg-astro-card border-2 rounded-3xl p-6 transition-all hover:shadow-2xl ${
                pkg.popular
                  ? 'border-astro-gold scale-105'
                  : 'border-astro-border hover:border-astro-gold/50'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-astro-gold text-white px-4 py-1 rounded-full text-xs font-bold">
                  BELIEBT
                </div>
              )}

              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-astro-gold/10 rounded-2xl flex items-center justify-center">
                  <span className="text-3xl">🪙</span>
                </div>
                <h3 className="font-serif text-xl text-astro-text">{pkg.name}</h3>
                <div className="space-y-1">
                  <div className="font-serif text-3xl text-astro-gold">{pkg.tokens}</div>
                  <div className="text-xs text-astro-subtext">Tokens</div>
                </div>
                {pkg.bonus && (
                  <div className="text-xs text-astro-gold font-semibold">{pkg.bonus}</div>
                )}
                <div className="pt-2">
                  <div className="font-sans text-2xl text-astro-text">
                    {formatPrice(pkg.price)}
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleTokenPurchase(pkg)}
                disabled={processing === pkg.id}
                className="w-full mt-6 py-3 bg-astro-text text-white rounded-xl font-sans font-semibold hover:bg-astro-text/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {processing === pkg.id ? 'Verarbeite...' : 'Kaufen'}
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Additional Info */}
      <div className="max-w-4xl mx-auto mt-12 p-6 bg-astro-card/50 border border-astro-border rounded-2xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div>
            <div className="text-2xl mb-2">🔒</div>
            <h4 className="font-serif text-sm text-astro-text mb-1">Sichere Zahlung</h4>
            <p className="text-xs text-astro-subtext">Powered by Stripe</p>
          </div>
          <div>
            <div className="text-2xl mb-2">↻</div>
            <h4 className="font-serif text-sm text-astro-text mb-1">Jederzeit kündbar</h4>
            <p className="text-xs text-astro-subtext">Keine versteckten Kosten</p>
          </div>
          <div>
            <div className="text-2xl mb-2">✨</div>
            <h4 className="font-serif text-sm text-astro-text mb-1">Sofortiger Zugang</h4>
            <p className="text-xs text-astro-subtext">Tokens sofort verfügbar</p>
          </div>
        </div>
      </div>
    </div>
  );
};
