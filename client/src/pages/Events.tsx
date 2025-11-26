import { useLanguage } from '@/lib/language';
import EventCard from '@/components/EventCard';
import event1Image from '@assets/generated_images/recent_event_example_1.png';
import event2Image from '@assets/generated_images/recent_event_example_2.png';
import event3Image from '@assets/generated_images/recent_event_example_3.png';
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';

export default function Events() {
  const { t } = useLanguage();
  const [expandedEvents, setExpandedEvents] = useState<Set<string>>(new Set());

  const { data: eventsResponse = [] } = useQuery<any>({
    queryKey: ['/api/events'],
  });

  const eventsFromDB = Array.isArray(eventsResponse) ? eventsResponse : (eventsResponse?.data ? Array.from(eventsResponse.data) : []);

  const defaultEvents = [
    {
      id: '1',
      title: 'শিক্ষা উপকরণ বিতরণ কর্মসূচি',
      titleEn: 'Educational Materials Distribution Program',
      date: '2025-01-15',
      location: 'নবাবপুর, বাংলাদেশ',
      locationEn: 'Nababpur, Bangladesh',
      image: event1Image,
      description: 'দরিদ্র শিক্ষার্থীদের মধ্যে শিক্ষা উপকরণ, বই এবং স্টেশনারি বিতরণ করা হবে। এই কর্মসূচিতে ১০০+ শিক্ষার্থী উপকৃত হবে।',
      descriptionEn: 'Distribution of educational materials, books, and stationery among underprivileged students. This program will benefit 100+ students.',
    },
    {
      id: '2',
      title: 'ক্রীড়া প্রতিযোগিতা ২০২৫',
      titleEn: 'Sports Competition 2025',
      date: '2025-01-20',
      location: 'কমিউনিটি স্টেডিয়াম',
      locationEn: 'Community Stadium',
      image: event2Image,
      description: 'স্থানীয় যুবকদের জন্য ফুটবল, ক্রিকেট এবং ভলিবল প্রতিযোগিতা। বিজয়ীদের পুরস্কার এবং সার্টিফিকেট প্রদান করা হবে।',
      descriptionEn: 'Football, cricket, and volleyball competitions for local youth. Winners will receive prizes and certificates.',
    },
    {
      id: '3',
      title: 'স্বাস্থ্য সচেতনতা কর্মসূচি',
      titleEn: 'Health Awareness Program',
      date: '2025-01-25',
      location: 'গ্রাম কমিউনিটি সেন্টার',
      locationEn: 'Village Community Center',
      image: event3Image,
      description: 'বিনামূল্যে স্বাস্থ্য পরীক্ষা, রক্তচাপ পরিমাপ, এবং স্বাস্থ্য বিষয়ক সেমিনার। বিশেষজ্ঞ চিকিৎসকদের পরামর্শ পাওয়া যাবে।',
      descriptionEn: 'Free health checkup, blood pressure measurement, and health seminar. Expert doctors will provide consultation.',
    },
    {
      id: '4',
      title: 'রমজান খাদ্য বিতরণ',
      titleEn: 'Ramadan Food Distribution',
      date: '2025-02-28',
      location: 'মসজিদ কমপ্লেক্স',
      locationEn: 'Mosque Complex',
      image: event1Image,
      description: 'রমজান মাসে দরিদ্র পরিবারগুলির জন্য খাদ্য সামগ্রী এবং ইফতার বিতরণ। প্রতিদিন ইফতার সরবরাহ করা হবে।',
      descriptionEn: 'Distribution of food items and iftar for poor families during Ramadan. Daily iftar will be provided.',
    },
    {
      id: '5',
      title: 'শীতকালীন কম্বল বিতরণ',
      titleEn: 'Winter Blanket Distribution',
      date: '2025-02-05',
      location: 'বিভিন্ন গ্রাম',
      locationEn: 'Various Villages',
      image: event2Image,
      description: 'শীতের সময় অসহায় মানুষদের মধ্যে উষ্ণ কম্বল এবং শীতবস্ত্র বিতরণ কর্মসূচি।',
      descriptionEn: 'Distribution of warm blankets and winter clothes among helpless people during winter.',
    },
    {
      id: '6',
      title: 'বৃক্ষরোপণ কর্মসূচি',
      titleEn: 'Tree Plantation Program',
      date: '2025-02-10',
      location: 'স্থানীয় পার্ক',
      locationEn: 'Local Park',
      image: event3Image,
      description: 'পরিবেশ সংরক্ষণের জন্য ৫০০+ ফলদ ও বনজ গাছ রোপণ কর্মসূচি। সবাই অংশগ্রহণ করতে পারবেন।',
      descriptionEn: 'Tree plantation program of 500+ fruit and forest trees for environmental conservation. Everyone can participate.',
    },
  ];

  const events = eventsFromDB && eventsFromDB.length > 0 ? eventsFromDB : defaultEvents;

  const toggleExpanded = (eventId: string) => {
    setExpandedEvents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(eventId)) {
        newSet.delete(eventId);
      } else {
        newSet.add(eventId);
      }
      return newSet;
    });
  };

  return (
    <div className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" data-testid="text-events-title">
            {t('আমাদের কার্যক্রম', 'Our Events')}
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed" data-testid="text-events-description">
            {t(
              'আমাদের সাম্প্রতিক এবং আসন্ন ইভেন্ট ও কার্যক্রম দেখুন',
              'View our recent and upcoming events and programs'
            )}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {events.map((event) => (
            <EventCard 
              key={event.id} 
              {...event} 
              isExpanded={expandedEvents.has(event.id)}
              onToggleExpand={() => toggleExpanded(event.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
