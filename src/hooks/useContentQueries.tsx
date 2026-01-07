import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchContents, addContent, deleteContent, shareBrain } from '../apiClient';

export const useContents = () => {
    return useQuery({
        queryKey: ['contents'],
        queryFn: fetchContents,
    })
}

export const useAddContent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: addContent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contents'] });
        }
    })
}

export const useDeleteContent = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteContent,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['contents'] });
        }
    })
}

export const useShareBrain = () => {
    return useMutation({
        mutationFn: shareBrain
    })
}