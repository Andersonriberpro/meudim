import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface Achievement {
    id: string;
    title: string;
    desc: string;
    status: 'LOCKED' | 'COMPLETE';
}

export const useAchievements = () => {
    const { user, userProfile } = useAuth();
    const [achievements, setAchievements] = useState<Achievement[]>([
        { id: '1', title: 'Primeiros Passos', desc: 'Realizou os primeiros cadastros', status: 'LOCKED' },
        { id: '2', title: 'Poupador Nato', desc: 'Manteve o saldo positivo por 30 dias', status: 'LOCKED' },
        { id: '3', title: 'Mestre Planejamento', desc: 'Criou 3 ou mais categorias metas de desejos', status: 'LOCKED' },
    ]);
    const [level, setLevel] = useState('Principiante');
    const [completionPercentage, setCompletionPercentage] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const calculateAchievements = useCallback(async () => {
        if (!user) return;

        try {
            // 1. Check Primeiros Passos (At least 1 transaction)
            const { count: transCount } = await supabase
                .from('transactions')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id);

            const hasTransactions = (transCount || 0) > 0;

            // 2. Check Poupador Nato (Balance > 0 AND Account Age >= 30 days)
            const { data: transData } = await supabase
                .from('transactions')
                .select('amount, type')
                .eq('user_id', user.id);

            const income = (transData || [])
                .filter(t => t.type === 'INCOME')
                .reduce((acc, t) => acc + Number(t.amount), 0);
            const expense = (transData || [])
                .filter(t => t.type === 'EXPENSE')
                .reduce((acc, t) => acc + Number(t.amount), 0);

            const balance = income - expense;

            const createdAt = userProfile?.created_at || user?.created_at;
            const accountAgeDays = createdAt
                ? Math.floor((new Date().getTime() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24))
                : 0;

            const isPoupadorNato = balance > 0 && accountAgeDays >= 30;

            // 3. Check Mestre Planejamento (At least 3 wishlist goals)
            const { count: goalsCount } = await supabase
                .from('wishlist_goals')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id);

            const hasThreeGoals = (goalsCount || 0) >= 3;

            const updateAchievements: Achievement[] = [
                { id: '1', title: 'Primeiros Passos', desc: 'Realizou os primeiros cadastros', status: hasTransactions ? 'COMPLETE' : 'LOCKED' },
                { id: '2', title: 'Poupador Nato', desc: 'Manteve o saldo positivo por 30 dias', status: isPoupadorNato ? 'COMPLETE' : 'LOCKED' },
                { id: '3', title: 'Mestre Planejamento', desc: 'Criou 3 ou mais categorias metas de desejos', status: hasThreeGoals ? 'COMPLETE' : 'LOCKED' },
            ];

            setAchievements(updateAchievements);

            const completedCount = updateAchievements.filter(a => a.status === 'COMPLETE').length;
            setCompletionPercentage(Math.round((completedCount / updateAchievements.length) * 100));

            if (completedCount >= 3) {
                setLevel('Veterano');
            } else if (completedCount >= 2) {
                setLevel('Amador');
            } else {
                setLevel('Principiante');
            }

        } catch (err) {
            console.error('Error calculating achievements:', err);
        } finally {
            setIsLoading(false);
        }
    }, [user, userProfile]);

    useEffect(() => {
        calculateAchievements();
    }, [calculateAchievements]);

    return { achievements, level, completionPercentage, isLoading, refresh: calculateAchievements };
};
