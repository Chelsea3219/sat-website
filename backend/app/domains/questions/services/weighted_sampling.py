# Import Python libraries and files
import random



def weighted_sampling_without_replacement(population, weights, k):
    # Pick k items from a list, without picking the same item twice, 
    # where items with a higher weight should be more likely to get picked 
    # but it's not guaranteed, just more probable
    if not population:
        return []

    k = min(k, len(population)) # cannot pick more items than exist
    pool = list( zip(population, weights) )
    selected = []

    for _ in range(k):
        total = sum(w for _, w in pool) # sum of all remaining weights
        r = random.uniform(0,total) # pick a random point along that total 
        upto = 0
        for i, (item,w) in enumerate(pool):
            upto += w
            if upto >= r: # found which slice r landed in 
                selected.append(item)
                pool.pop(i) # remove it so it's can't be picked again
                break
    return selected