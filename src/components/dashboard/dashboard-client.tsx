'use client';

import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { getCommunities, getMembers, getMessages } from '@/app/actions';
import { Community, Member, Message } from '@/types';
import { CommunityList } from './community-list';
import { MemberList } from './member-list';
import { MessageList } from './message-list';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Flame } from 'lucide-react';

export type DataSource = 'mongodb' | 'firestore';

export function DashboardClient({
  communities,
  dataSource,
}: {
  communities: Community[];
  dataSource: DataSource;
}) {
  // Use Next.js useSearchParams hook to access URL parameters
  const searchParams = useSearchParams();
  
  // Safely parse search params
  const parsedSearchParams = useMemo(() => {
    return {
      communityId: searchParams?.get('communityId') || undefined,
      memberId: searchParams?.get('memberId') || undefined
    };
  }, [searchParams]);
  const router = useRouter();
  const pathname = usePathname();
  const updateTimeout = useRef<NodeJS.Timeout | null>(null);

  const getInitialCommunityId = () => {
    const communityIdFromParams = parsedSearchParams.communityId;
    if (communityIdFromParams && communities.some(c => c.id === communityIdFromParams)) {
      return communityIdFromParams;
    }
    return '';
  };
  
  const getInitialMemberId = () => {
    return parsedSearchParams.memberId;
  };


  const [selectedCommunityId, setSelectedCommunityId] = useState(getInitialCommunityId());
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);


  const debouncedUpdateUrl = useCallback((newSearchParams: URLSearchParams) => {
    if (updateTimeout.current) {
        clearTimeout(updateTimeout.current);
    }
    updateTimeout.current = setTimeout(() => {
        router.replace(`${pathname}?${newSearchParams.toString()}`, { scroll: false });
    }, 300);
  }, [pathname, router]);

  const handleSelectCommunity = (communityId: string | null) => {
    const newId = communityId === selectedCommunityId ? null : communityId;
    setSelectedCommunityId(newId || '');
    setSelectedMember(null); 
    const newSearchParams = new URLSearchParams();
    if (newId) {
      newSearchParams.set('communityId', newId);
    }
    debouncedUpdateUrl(newSearchParams);
  };

  const handleSelectMember = useCallback((member: Member | null) => {
    setSelectedMember(member);
    const newSearchParams = new URLSearchParams();
     if (selectedCommunityId) {
      newSearchParams.set('communityId', selectedCommunityId);
    }
    if(member?.id) {
        newSearchParams.set('memberId', member.id);
    }
    debouncedUpdateUrl(newSearchParams);
  }, [selectedCommunityId, debouncedUpdateUrl]);

  useEffect(() => {
    return () => {
      if (updateTimeout.current) {
        clearTimeout(updateTimeout.current);
      }
    };
  }, []);

  const selectedCommunity = communities.find(c => c.id === selectedCommunityId);

  return (
    <div className="flex h-full flex-col bg-background">
      <main className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full w-full">
          <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
            <CommunityList
              communities={communities}
              selectedCommunityId={selectedCommunityId}
              onSelectCommunity={handleSelectCommunity}
              showExport={dataSource === 'mongodb'}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
            <MemberList 
              key={`${dataSource}-${selectedCommunityId}`}
              communityId={selectedCommunityId}
              onSelectMember={handleSelectMember}
              initialSelectedMemberId={getInitialMemberId()}
              dataSource={dataSource}
            />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize={50} minSize={30}>
             <MessageList 
                key={`${dataSource}-${selectedCommunityId}-${selectedMember?.id}`}
                communityId={selectedCommunityId} 
                communityName={selectedCommunity?.name}
                member={selectedMember}
                dataSource={dataSource}
              />
          </ResizablePanel>
        </ResizablePanelGroup>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Communities
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{communities.length}</div>
              <p className="text-xs text-muted-foreground">
                Total communities in the system
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Firebase Tests
              </CardTitle>
              <Flame className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <Link href="/test-firebase" className="text-sm text-blue-600 hover:underline">
                  Test Firebase Service Account
                </Link>
                <Link href="/test-migration" className="text-sm text-blue-600 hover:underline">
                  Test Migration Strategy
                </Link>
                <Link href="/check-firebase" className="text-sm text-blue-600 hover:underline">
                  Check Firebase Permissions
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
