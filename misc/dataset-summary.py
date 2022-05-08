import os
import pathlib
path = pathlib.Path(__file__).parent.absolute()
folders = os.listdir(path / '../Fruits/fruits-360_dataset/fruits-360/Training')
# csvF = open('classDistribution.csv', 'w')
rows = {}
# counter = 0
for folder in sorted(folders):
    folderPath = path / '../Fruits/fruits-360_dataset/fruits-360/Training' / folder

    # count number of files in folder
    fileCount = len([name for name in os.listdir(folderPath) if os.path.isfile(os.path.join(folderPath, name))])
    rows[folder] = fileCount
    # if counter >= 30:
    #     counter = 0

    # if counter > len(rows):
    #     rows.append('')

    # rows[counter] = rows[counter] + ',' + folder + ',' + str(fileCount)
    # counter += 1


# for row in rows:
#     csvF.write(row.strip(',') + '\n')
# csvF.close()

# find folder with minimum and maximum number of files
minFolder = min(rows, key=rows.get)
maxFolder = max(rows, key=rows.get)

print('Min: ' + minFolder + ' (' + str(rows[minFolder]) + ')')
print('Max: ' + maxFolder + ' (' + str(rows[maxFolder]) + ')')

# calculate avergae number of files
total = 0
for folder in rows:
    total += rows[folder]

average = total / len(rows)
print('Average: ' + str(average))

# calculate standard deviation of number of files
total = 0
for folder in rows:
    total += (rows[folder] - average) ** 2

deviation = (total / len(rows)) ** 0.5
print('Deviation: ' + str(deviation))
