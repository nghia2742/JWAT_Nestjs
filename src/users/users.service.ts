import {
    ConflictException,
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryParams } from 'src/types';

@Injectable()
export class UsersService {
    private listUsers = [
        {
            username: 'Ironman',
            fullname: 'Tonny Stack',
            role: 'Developer',
            project: ['Tiger'],
            activeYn: 'Y',
        },
        {
            username: 'Thor',
            fullname: 'Thor Odinson',
            role: 'Manager',
            project: ['Eagle'],
            activeYn: 'Y',
        },
        {
          username: 'Black',
          fullname: 'Black Panther',
          role: 'Staff',
          project: ['Tiger', 'Eagle'],
          activeYn: 'Y',
      },
    ];

    create(createUserDto: CreateUserDto) {
        const users = this.listUsers;
        const duplicateUser = users.find(
            (u) => u.username === createUserDto.username,
        );
        if (duplicateUser) {
            throw new ConflictException(
                `User ${createUserDto.username} already exists`,
            );
        }
        this.listUsers.push(createUserDto);
        return createUserDto;
    }

    findAll(queryParam: UserQueryParams) {
        const { username, fullname, role, project, activeYn } = queryParam;

        let filteredUsers = this.listUsers;

        if (username) {
            filteredUsers = filteredUsers.filter(
                (user) =>
                    user.username.toLowerCase() === username.toLowerCase(),
            );
        }

        if (fullname) {
            filteredUsers = filteredUsers.filter((user) =>
                user.fullname.toLowerCase().includes(fullname.toLowerCase()),
            );
        }

        if (role) {
            filteredUsers = filteredUsers.filter(
                (user) => user.role.toLowerCase() === role.toLowerCase(),
            );
        }

        if (project) {
            const queryProject = project.map(p => p.toLowerCase());
            filteredUsers = filteredUsers.filter((user) =>
                user.project.find((p) => queryProject.includes(p.toLowerCase())),
            );
        }

        if (activeYn) {
            filteredUsers = filteredUsers.filter(
                (user) => user.activeYn === activeYn.toUpperCase(),
            );
        }

        if (!filteredUsers.length) {
            throw new NotFoundException();
        }
        return filteredUsers;
    }

    findOne(username: string) {
        const users = this.listUsers;
        const userIndex = users.findIndex(
            (u) => u.username.toLowerCase() === username.toLowerCase(),
        );

        if (userIndex === -1) {
            throw new NotFoundException(`User ${username} not found`);
        }
        return users[userIndex];
    }

    update(username: string, updateUserDto: UpdateUserDto) {
        const users = this.listUsers;
        const userIndex = users.findIndex(
            (u) => u.username.toLowerCase() === username.toLowerCase(),
        );

        if (userIndex === -1) {
            throw new NotFoundException(`User ${username} not found`);
        }

        // Check for duplicate username
        if (updateUserDto.username && updateUserDto.username !== username) {
            const duplicateUser = users.find(
                (u) => u.username === updateUserDto.username,
            );
            if (duplicateUser) {
                throw new ConflictException(
                    `User ${updateUserDto.username} already exists`,
                );
            }
        }

        // // Update user information
        users[userIndex] = { ...users[userIndex], ...updateUserDto };

        return updateUserDto;
    }

    remove(username: string) {
        const users = this.listUsers;
        const userIndex = users.findIndex(
            (u) => u.username.toLowerCase() === username.toLowerCase(),
        );
        if (userIndex === -1) {
            throw new NotFoundException(`User ${username} not found`);
        }

        users.splice(userIndex, 1);
        return { message: 'User deleted successfully' };
    }
}
