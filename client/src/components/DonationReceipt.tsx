import { useLanguage } from '@/lib/language';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageCircle, Printer, X } from 'lucide-react';
import logoUrl from '@assets/logo_1764081884326.jpg';

interface DonationReceiptProps {
  name: string;
  amount: number;
  purpose: string;
  transactionId: string;
  paymentMethod: string;
  email: string;
  phone: string;
  onClose: () => void;
}

export function DonationReceipt({
  name,
  amount,
  purpose,
  transactionId,
  paymentMethod,
  email,
  phone,
  onClose,
}: DonationReceiptProps) {
  const { t, language } = useLanguage();

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleWhatsAppShare = () => {
    const message = language === 'en' 
      ? `Hello, I have made a donation of ৳${amount} for ${purpose}. Transaction ID: ${transactionId}. Please verify and approve this donation.`
      : `আসালামু আলাইকুম, আমি ৳${amount} দান করেছি ${purpose} এর জন্য। ট্রানজেকশন আইডি: ${transactionId}। অনুগ্রহ করে এটি যাচাই করে মনজুর করুন।`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center p-6 border-b">
          <CardTitle className="text-2xl">
            {t('দান রশিদ', 'Donation Receipt')}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            data-testid="button-close-receipt"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <CardContent className="p-6">
          <div
            className="bg-white p-8 space-y-6 border border-gray-200 rounded-lg print:border-0 print:p-0"
          >
            <div className="text-center space-y-2 pb-6 border-b">
              <img
                src={logoUrl}
                alt="আজাদী সমাজ কল্যাণ সংঘ"
                className="h-16 mx-auto"
              />
              <h1 className="text-2xl font-bold text-gray-900">
                {t('আজাদী সমাজ কল্যাণ সংঘ', 'Azadi Social Welfare Organization')}
              </h1>
              <p className="text-sm text-gray-600">
                {t('প্রতিষ্ঠিত: ১০ জুন ১৯৮৮', 'Established: June 10, 1988')}
              </p>
              <p className="text-sm text-gray-600">
                {t('ঠিকানা: ঢাকা, বাংলাদেশ', 'Address: Dhaka, Bangladesh')}
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-900 text-center">
                {t('দান প্রমাণপত্র', 'Donation Certificate')}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600 font-semibold">
                    {t('দাতার নাম', 'Donor Name')}
                  </p>
                  <p className="text-gray-900 font-bold">{name}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">
                    {t('ইমেইল', 'Email')}
                  </p>
                  <p className="text-gray-900">{email}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">
                    {t('ফোন নম্বর', 'Phone')}
                  </p>
                  <p className="text-gray-900">{phone}</p>
                </div>
                <div>
                  <p className="text-gray-600 font-semibold">
                    {t('দানের তারিখ', 'Date of Donation')}
                  </p>
                  <p className="text-gray-900">
                    {new Date().toLocaleDateString(language === 'en' ? 'en-US' : 'bn-BD')}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-semibold">
                    {t('দানের পরিমাণ', 'Donation Amount')}
                  </span>
                  <span className="text-2xl font-bold text-blue-600">৳{amount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-semibold">
                    {t('দানের উদ্দেশ্য', 'Purpose')}
                  </span>
                  <span className="text-gray-900 font-semibold">{purpose}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-semibold">
                    {t('পেমেন্ট পদ্ধতি', 'Payment Method')}
                  </span>
                  <span className="text-gray-900 font-semibold uppercase">
                    {paymentMethod}
                  </span>
                </div>
                <div className="border-t pt-3 flex justify-between items-center">
                  <span className="text-gray-600 font-semibold">
                    {t('ট্রানজেকশন আইডি', 'Transaction ID')}
                  </span>
                  <span className="text-gray-900 font-mono font-bold">{transactionId}</span>
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
                <p className="text-sm text-amber-900 font-semibold mb-2">
                  {t('গুরুত্বপূর্ণ নির্দেশনা', 'Important Instructions')}:
                </p>
                <p className="text-sm text-amber-800 leading-relaxed">
                  {t(
                    'এই রশিদটি WhatsApp এর মাধ্যমে আমাদের অ্যাডমিন এর কাছে পাঠান। আমরা আপনার দান যাচাই করে অনুমোদন করব এবং এটি আমাদের ওয়েবসাইটে প্রকাশ করা হবে।',
                    'Send this receipt to our admin via WhatsApp. We will verify your donation and approve it, after which it will be published on our website.'
                  )}
                </p>
              </div>

              <div className="border-t pt-4">
                <p className="text-xs text-gray-600 text-center">
                  {t('ধন্যবাদ আমাদের সমাজের জন্য অবদান রাখার জন্য', 'Thank you for your contribution to our society')}
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-6 print:hidden">
            <Button
              onClick={handlePrintReceipt}
              variant="outline"
              className="flex-1"
              data-testid="button-print-receipt"
            >
              <Printer className="h-4 w-4 mr-2" />
              {t('প্রিন্ট করুন', 'Print')}
            </Button>
            <Button
              onClick={handleWhatsAppShare}
              className="flex-1 bg-green-600 hover:bg-green-700"
              data-testid="button-whatsapp-share"
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              {t('WhatsApp এ পাঠান', 'Send via WhatsApp')}
            </Button>
            <Button
              onClick={onClose}
              variant="secondary"
              className="flex-1"
              data-testid="button-close-receipt-bottom"
            >
              {t('বন্ধ করুন', 'Close')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
